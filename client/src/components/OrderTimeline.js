import React from "react";

const steps = ["PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderTimeline({ history = [] }) {
  // make dictionary {status -> first timestamp}
  const map = {};
  history.forEach(h => { if (!map[h.status]) map[h.status] = h.at || h.createdAt; });

  return (
    <div style={{display:"grid", gap:10, marginTop:12}}>
      {steps.map((s, idx) => {
        const done = !!map[s];
        return (
          <div key={s} style={{display:"flex", alignItems:"center", gap:10}}>
            <div style={{
              width: 14, height: 14, borderRadius: 999,
              background: done ? "#10b981" : "#e5e7eb", border: "2px solid #d1d5db"
            }}/>
            <div style={{minWidth:100, fontWeight:600}}>{s.toLowerCase()}</div>
            <div style={{fontSize:12, color:"#6b7280"}}>
              {done ? new Date(map[s]).toLocaleString() : "pending"}
            </div>
            {idx < steps.length - 1 && (
              <div style={{flex:1, height:2, background:"#e5e7eb", marginLeft:10}}/>
            )}
          </div>
        );
      })}
    </div>
  );
}
