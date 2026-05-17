import React from "react"

export const AnalysisContainer = ({ data, isLoading, error }) => {
  if (error) return <div style={{background: '#2D3436', color: '#ff7675', padding: '20px', borderRadius: '20px', border: '1px solid #ff7675', width: '340px'}}>⚠️ {error}</div>
  if (isLoading) return <div style={{background: '#2D3436', color: '#00FFC2', padding: '30px', borderRadius: '24px', textAlign: 'center', border: '1px solid #00FFC2', width: '340px'}}>🔍 Analyserer tilstand og nabolag...</div>
  if (!data) return null

  const tgs = data.tg_report || { tg1: 0, tg2: 0, tg3: 0 };

  return (
    <div style={{background: '#2D3436', borderRadius: '28px', boxShadow: '0 30px 60px rgba(0,0,0,0.7)', width: '360px', overflow: 'hidden', border: '1px solid rgba(0, 255, 194, 0.2)', fontFamily: 'sans-serif', color: 'white'}}>
      
      {/* Header */}
      <div style={{padding: '20px 24px', borderBottom: '1px solid rgba(0, 255, 194, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{fontWeight: '900', color: '#00FFC2', fontSize: '20px'}}>Fintelligens AI</span>
        <div style={{background: '#00FFC2', color: '#2D3436', fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: '900'}}>LIVE</div>
      </div>

      <div style={{padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
        
        {/* NØYAKTIG TG-TELLING */}
        <div style={{display: 'flex', gap: '8px'}}>
          <div style={{flex: 1, background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(74, 222, 128, 0.3)'}}>
            <span style={{fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: 'bold'}}>TG1</span>
            <span style={{fontSize: '12px', fontWeight: '900', color: '#4ade80'}}>{tgs.tg1} stk</span>
          </div>
          <div style={{flex: 1, background: tgs.tg2 > 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '14px', textAlign: 'center', border: tgs.tg2 > 0 ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)'}}>
            <span style={{fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: 'bold'}}>TG2</span>
            <span style={{fontSize: '12px', fontWeight: '900', color: tgs.tg2 > 0 ? '#fbbf24' : '#94a3b8'}}>{tgs.tg2} stk</span>
          </div>
          <div style={{flex: 1, background: tgs.tg3 > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '14px', textAlign: 'center', border: tgs.tg3 > 0 ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)'}}>
            <span style={{fontSize: '9px', color: '#94a3b8', display: 'block', fontWeight: 'bold'}}>TG3</span>
            <span style={{fontSize: '12px', fontWeight: '900', color: tgs.tg3 > 0 ? '#ef4444' : '#94a3b8'}}>{tgs.tg3} stk</span>
          </div>
        </div>

        {/* Pris & Score */}
        <div style={{display: 'flex', gap: '15px'}}>
          <div style={{flex: 1, background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <span style={{fontSize: '10px', color: '#b2bec3', fontWeight: 'bold'}}>MARKEDSVERDI</span>
            <div style={{fontSize: '18px', fontWeight: '900', color: '#00FFC2'}}>{data.estimated_market_price?.toLocaleString()} kr</div>
          </div>
          <div style={{width: '90px', background: 'rgba(0, 255, 194, 0.1)', padding: '15px', borderRadius: '18px', border: '1px solid #00FFC2', textAlign: 'center'}}>
            <span style={{fontSize: '10px', color: '#00FFC2', fontWeight: 'bold'}}>SCORE</span>
            <div style={{fontSize: '18px', fontWeight: '900', color: '#00FFC2'}}>{data.investment_score}</div>
          </div>
        </div>

        {/* AI Vurdering */}
        <p style={{fontSize: '13px', color: '#dfe6e9', lineHeight: '1.6', margin: 0, fontStyle: 'italic', borderLeft: '3px solid #00FFC2', paddingLeft: '15px'}}>
          "{data.summary}"
        </p>

        {/* Budstrategi */}
        <div style={{background: 'rgba(0, 255, 194, 0.08)', padding: '18px', borderRadius: '22px', border: '1px solid rgba(0, 255, 194, 0.3)'}}>
          <h4 style={{fontSize: '11px', fontWeight: '900', color: '#00FFC2', margin: '0 0 8px 0', textTransform: 'uppercase'}}>Anbefalt Budstrategi</h4>
          <p style={{fontSize: '13px', color: 'white', lineHeight: '1.5', margin: 0}}>{data.suggested_bid_strategy}</p>
        </div>

        {/* Røde Flagg */}
        {data.red_flags?.length > 0 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <h4 style={{fontSize: '11px', fontWeight: '900', color: '#ff7675', textTransform: 'uppercase'}}>Kritiske Funn</h4>
            {data.red_flags.map((f, i) => (
              <div key={i} style={{fontSize: '12px', color: '#ff7675', background: 'rgba(214, 48, 49, 0.1)', padding: '8px 12px', borderRadius: '10px'}}>🚩 {f}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
