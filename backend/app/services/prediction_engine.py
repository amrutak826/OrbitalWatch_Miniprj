from datetime import datetime, timedelta, timezone

from app.services.orbit_engine import tle_to_satrec, distance_km, propagate_at_time


def predict_future_approaches(sat_row, debris_df, hours=12, step_min=5, threshold_km=50):
    """
    Propagate satellite and all debris for a certain time window
    and find predicted close approaches.
    """

    sat_obj = tle_to_satrec(sat_row["Line1"], sat_row["Line2"])

    if sat_obj is None:
        return {"error": "Invalid satellite TLE"}

    now = datetime.now(timezone.utc)
    end_time = now + timedelta(hours=hours)

    results = []

    # Loop through time window
    t = now
    while t <= end_time:
        sat_pos = propagate_at_time(sat_obj, t)

        if sat_pos is None:
            t += timedelta(minutes=step_min)
            continue

        # Check against debris
        for _, deb in debris_df.iterrows():
            deb_obj = tle_to_satrec(deb["Line1"], deb["Line2"])
            deb_pos = propagate_at_time(deb_obj, t)

            if deb_pos is None:
                continue

            d = distance_km(sat_pos, deb_pos)

            if d <= threshold_km:
                results.append({
                    "timestamp": t.isoformat(),
                    "debris": deb["Name"],
                    "distance_km": d,
                })

        t += timedelta(minutes=step_min)

    # Sort results
    results = sorted(results, key=lambda x: x["distance_km"])

    return results
