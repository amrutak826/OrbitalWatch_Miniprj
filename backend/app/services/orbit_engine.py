from sgp4.api import Satrec
from datetime import datetime, timezone
import numpy as np

def tle_to_satrec(line1, line2):
    """Convert TLE strings into an SGP4 satellite object"""
    return Satrec.twoline2rv(line1, line2)

def get_position_km(satrec, return_velocity=False):
    now = datetime.now(timezone.utc)
    jd = now.timestamp() / 86400.0 + 2440587.5
    fr = (now.timestamp() % 1)

    e, r, v = satrec.sgp4(jd, fr)
    if e != 0:
        return (None, None) if return_velocity else None

    if return_velocity:
        return np.array(r), np.array(v)
    return np.array(r)


def distance_km(obj1, obj2):
    """Euclidean distance between two ECI coordinate vectors."""
    return float(np.linalg.norm(obj1 - obj2))


def propagate_at_time(satrec, dt):
    """Propagate satellite to a given datetime."""
    try:
        jd = dt.timestamp() / 86400.0 + 2440587.5
        fr = (dt.timestamp() % 1)
        e, r, v = satrec.sgp4(jd, fr)

        if e != 0:
            return None

        return np.array(r)

    except:
        return None
