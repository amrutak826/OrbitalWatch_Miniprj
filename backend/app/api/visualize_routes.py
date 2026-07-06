# app/api/visualize_routes.py
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
import matplotlib.pyplot as plt
import io
from datetime import datetime, timedelta, timezone
from app.services.orbit_engine import tle_to_satrec, propagate_at_time
from app.services.data_loader import load_satellites, load_debris
import numpy as np

router = APIRouter(prefix="/api/collision", tags=["Collision Visualization"])

def sample_orbit_positions(satrec, start, hours=1, step_min=1):
    pts = []
    t = start
    end = start + timedelta(hours=hours)
    while t <= end:
        p = propagate_at_time(satrec, t)
        if p is not None:
            pts.append(p)
        t += timedelta(minutes=step_min)
    return np.array(pts)

@router.get("/visualize")
def visualize_pair(sat_name: str = Query(...), deb_name: str = Query(...), hours: int = 1, step_min: int = 1):
    sats = load_satellites(); debs = load_debris()
    sat_row = sats[sats["Name"] == sat_name]; deb_row = debs[debs["Name"] == deb_name]
    if sat_row.empty or deb_row.empty:
        raise HTTPException(status_code=404, detail="sat or debris not found")
    satrec = tle_to_satrec(sat_row.iloc[0]["Line1"], sat_row.iloc[0]["Line2"])
    debrec = tle_to_satrec(deb_row.iloc[0]["Line1"], deb_row.iloc[0]["Line2"])
    start = datetime.now(timezone.utc)
    sat_pts = sample_orbit_positions(satrec, start, hours=hours, step_min=step_min)
    deb_pts = sample_orbit_positions(debrec, start, hours=hours, step_min=step_min)

    # simple 3D scatter plot with Matplotlib
    fig = plt.figure(figsize=(6,6))
    ax = fig.add_subplot(111, projection='3d')
    if len(sat_pts)>0:
        ax.plot(sat_pts[:,0], sat_pts[:,1], sat_pts[:,2], label='sat', linewidth=1)
        ax.scatter([sat_pts[0,0]],[sat_pts[0,1]],[sat_pts[0,2]], c='blue', s=30)
    if len(deb_pts)>0:
        ax.plot(deb_pts[:,0], deb_pts[:,1], deb_pts[:,2], label='deb', color='red', linewidth=1)
        ax.scatter([deb_pts[0,0]],[deb_pts[0,1]],[deb_pts[0,2]], c='red', s=30)
    ax.set_xlabel('X (km)'); ax.set_ylabel('Y (km)'); ax.set_zlabel('Z (km)')
    ax.legend()
    buf = io.BytesIO()
    plt.tight_layout(); plt.savefig(buf, format='png', dpi=150); plt.close(fig)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
