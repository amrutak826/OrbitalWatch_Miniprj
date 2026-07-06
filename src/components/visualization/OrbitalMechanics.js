/**
 * Orbital mechanics utilities for satellite position calculation from TLE data
 */

const EARTH_RADIUS = 6371; // km
const MINUTES_PER_DAY = 1440;
const TWO_PI = Math.PI * 2;

/**
 * Parse TLE (Two-Line Element) data
 */
export function parseTLE(line1, line2) {
    const inclination = parseFloat(line2.substring(8, 16));
    const rightAscension = parseFloat(line2.substring(17, 25));
    const eccentricity = parseFloat("0." + line2.substring(26, 33).trim());
    const argOfPerigee = parseFloat(line2.substring(34, 42));
    const meanAnomaly = parseFloat(line2.substring(43, 51));
    const meanMotion = parseFloat(line2.substring(52, 63));

    const n = (meanMotion * TWO_PI) / MINUTES_PER_DAY; // rad/sec
    const a = Math.pow(398600.4418 / (n * n), 1 / 3); // km

    return {
        inclination: (inclination * Math.PI) / 180,
        rightAscension: (rightAscension * Math.PI) / 180,
        eccentricity,
        argOfPerigee: (argOfPerigee * Math.PI) / 180,
        meanAnomaly: (meanAnomaly * Math.PI) / 180,
        meanMotion,
        semiMajorAxis: a,
    };
}

/**
 * Calculate satellite position from TLE at a given time offset
 */
export function calculatePosition(tle, timeOffset) {
    const {
        inclination,
        rightAscension,
        eccentricity,
        argOfPerigee,
        meanAnomaly,
        meanMotion,
        semiMajorAxis,
    } = tle;

    const M =
        meanAnomaly +
        ((meanMotion * TWO_PI) / MINUTES_PER_DAY) * timeOffset;

    let E = M;
    for (let i = 0; i < 5; i++) {
        E = M + eccentricity * Math.sin(E);
    }

    const v =
        2 *
        Math.atan2(
            Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
            Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
        );

    const r = semiMajorAxis * (1 - eccentricity * Math.cos(E));

    const x_orb = r * Math.cos(v);
    const y_orb = r * Math.sin(v);

    const cosRaan = Math.cos(rightAscension);
    const sinRaan = Math.sin(rightAscension);
    const cosInc = Math.cos(inclination);
    const sinInc = Math.sin(inclination);
    const cosArgp = Math.cos(argOfPerigee);
    const sinArgp = Math.sin(argOfPerigee);

    const x =
        (cosRaan * cosArgp - sinRaan * sinArgp * cosInc) * x_orb +
        (-cosRaan * sinArgp - sinRaan * cosArgp * cosInc) * y_orb;

    const y =
        (sinRaan * cosArgp + cosRaan * sinArgp * cosInc) * x_orb +
        (-sinRaan * sinArgp + cosRaan * cosArgp * cosInc) * y_orb;

    const z = sinInc * sinArgp * x_orb + sinInc * cosArgp * y_orb;

    return { x, y, z, altitude: r - EARTH_RADIUS };
}

/**
 * Fetch TLE data from Celestrak
 */
export async function fetchTLEData(category = "active") {
    try {
        const response = await fetch(
            `https://celestrak.org/NORAD/elements/gp.php?GROUP=${category}&FORMAT=tle`
        );

        const text = await response.text();
        const lines = text.trim().split("\n");
        const satellites = [];

        for (let i = 0; i < lines.length; i += 3) {
            if (i + 2 >= lines.length) break;

            const name = lines[i].trim();
            const line1 = lines[i + 1];
            const line2 = lines[i + 2];

            if (line1.startsWith("1 ") && line2.startsWith("2 ")) {
                try {
                    const tle = parseTLE(line1, line2);
                    const noradId = line1.substring(2, 7).trim();

                    satellites.push({
                        name,
                        noradId,
                        tle,
                        line1,
                        line2,
                    });
                } catch (e) {
                    console.warn(`Failed to parse TLE for ${name}:`, e);
                }
            }
        }

        return satellites;
    } catch (error) {
        console.error("Error fetching TLE data:", error);
        return [];
    }
}

/**
 * Calculate trajectory over a range of minutes
 */
export function calculateTrajectory(tle, startTime, endTime, steps = 100) {
    const trajectory = [];
    const timeStep = (endTime - startTime) / steps;

    for (let i = 0; i <= steps; i++) {
        const timeOffset = startTime + i * timeStep;
        trajectory.push(calculatePosition(tle, timeOffset));
    }

    return trajectory;
}

/**
 * Detect collision risk between two satellites
 */
export function detectCollision(
    sat1TLE,
    sat2TLE,
    timeRange = 1440,
    threshold = 50
) {
    const steps = 144; // every 10 min
    const timeStep = timeRange / steps;

    let minDistance = Infinity;
    let minDistanceTime = 0;

    for (let i = 0; i <= steps; i++) {
        const time = i * timeStep;

        const pos1 = calculatePosition(sat1TLE, time);
        const pos2 = calculatePosition(sat2TLE, time);

        const distance = Math.sqrt(
            (pos1.x - pos2.x) ** 2 +
            (pos1.y - pos2.y) ** 2 +
            (pos1.z - pos2.z) ** 2
        );

        if (distance < minDistance) {
            minDistance = distance;
            minDistanceTime = time;
        }
    }

    return {
        minDistance,
        minDistanceTime,
        isRisk: minDistance < threshold,
    };
}
