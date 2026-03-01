import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function MacroBadge({ emoji, value, label, bg, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      background: bg, borderRadius: '100px', padding: '6px 14px'
    }}>
      <span style={{ fontSize: '14px' }}>{emoji}</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color }}>{value}</span>
      <span style={{ fontSize: '12px', color, opacity: 0.8 }}>{label}</span>
    </div>
  )
}

function MealCard({ meal }) {
  return (
    <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
      <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b8f71', letterSpacing: '0.05em' }}>{meal.type}</span>
      <h4 style={{ fontWeight: '600', fontSize: '14px', color: '#2d4a3e', margin: '4px 0' }}>{meal.name}</h4>
      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>{meal.description}</p>

      {/* Macros Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
        <div style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', backgroundColor: '#fef3c7' }}>
          <p style={{ fontSize: '12px', color: '#92400e' }}>🔥</p>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#92400e' }}>{meal.calories}</p>
          <p style={{ fontSize: '11px', color: '#92400e' }}>kcal</p>
        </div>
        <div style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', backgroundColor: '#dbeafe' }}>
          <p style={{ fontSize: '12px', color: '#1e40af' }}>💪</p>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e40af' }}>{meal.protein}g</p>
          <p style={{ fontSize: '11px', color: '#1e40af' }}>protein</p>
        </div>
        <div style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', backgroundColor: '#fce7f3' }}>
          <p style={{ fontSize: '12px', color: '#9d174d' }}>🍞</p>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#9d174d' }}>{meal.carbs}g</p>
          <p style={{ fontSize: '11px', color: '#9d174d' }}>carbs</p>
        </div>
        <div style={{ textAlign: 'center', padding: '8px', borderRadius: '12px', backgroundColor: '#d1fae5' }}>
          <p style={{ fontSize: '12px', color: '#065f46' }}>🥑</p>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#065f46' }}>{meal.fat}g</p>
          <p style={{ fontSize: '11px', color: '#065f46' }}>fat</p>
        </div>
      </div>

      {/* Ingredients */}
      {meal.ingredients && meal.ingredients.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#2d4a3e', marginBottom: '6px' }}>📋 Ingredients:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {meal.ingredients.map((ing, i) => (
              <span key={i} style={{
                fontSize: '11px', padding: '4px 10px', borderRadius: '100px',
                backgroundColor: '#f0f7f1', color: '#2d4a3e', border: '1px solid #d1fae5'
              }}>
                {ing.name} — {ing.amount}
              </span>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>⏱ ~{meal.prepTime} mins</p>
    </div>
  )
}

function DayCard({ dayData, index }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', marginBottom: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', padding: '20px 24px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: open ? '#2d7d46' : '#f0f7f1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700',
            color: open ? 'white' : '#2d4a3e', flexShrink: 0
          }}>
            {index + 1}
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: '700', fontSize: '16px', color: '#2d4a3e' }}>{dayData.day}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{dayData.meals?.length} meals · {dayData.totalCalories} cal</p>
          </div>
        </div>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', background: '#f0f7f1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', color: '#2d4a3e',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease'
        }}>▼</div>
      </button>

      {open && (
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            <MacroBadge emoji="🔥" value={dayData.totalCalories} label="cal" bg="#fef3c7" color="#92400e" />
            <MacroBadge emoji="💪" value={`${dayData.protein}g`} label="protein" bg="#dbeafe" color="#1e40af" />
            <MacroBadge emoji="🍞" value={`${dayData.carbs}g`} label="carbs" bg="#fce7f3" color="#9d174d" />
            <MacroBadge emoji="🥑" value={`${dayData.fat}g`} label="fat" bg="#d1fae5" color="#065f46" />
          </div>

          {dayData.meals?.map((meal, i) => (
            <MealCard key={i} meal={meal} />
          ))}

          {dayData.whyThisWorks && (
            <div style={{
              background: 'linear-gradient(135deg, #f0faf2, #e8f5ea)',
              borderRadius: '16px', padding: '16px 20px',
              border: '1px solid #d1fae5', marginTop: '4px'
            }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#2d7d46', marginBottom: '4px' }}>
                ✨ Why this works for you
              </p>
              <p style={{ fontSize: '14px', color: '#2d4a3e', lineHeight: '1.6' }}>
                {dayData.whyThisWorks}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MealPlan({ plan, onBack }) {
  const [groceryOpen, setGroceryOpen] = useState(false)

  const exportPDF = async () => {
    // First expand all day cards
    const allDayButtons = document.querySelectorAll('#meal-plan-content button')
    
    // Open all days temporarily
    const originalStates = []
    
    try {
      // Create a printable div with all data
      const printDiv = document.createElement('div')
      printDiv.style.cssText = 'position:fixed;top:0;left:0;width:800px;background:#f5f0e8;padding:40px;z-index:9999;font-family:sans-serif;'
      
      // Title
      printDiv.innerHTML = `
        <div style="text-align:center;margin-bottom:30px;padding:30px;background:linear-gradient(135deg,#1a3a2a,#2d6a4f);border-radius:16px;color:white;">
          <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;">⚡ DietX — Your 7-Day Meal Plan</h1>
          <p style="opacity:0.8;font-size:14px;">${plan.summary}</p>
        </div>
  
        ${plan.days?.map((day, di) => `
          <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f0f7f1;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:36px;height:36px;border-radius:50%;background:#2d7d46;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;">${di + 1}</div>
                <h2 style="font-size:20px;font-weight:700;color:#2d4a3e;">${day.day}</h2>
              </div>
              <div style="display:flex;gap:8px;">
                <span style="background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;">🔥 ${day.totalCalories} cal</span>
                <span style="background:#dbeafe;color:#1e40af;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;">💪 ${day.protein}g protein</span>
                <span style="background:#fce7f3;color:#9d174d;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;">🍞 ${day.carbs}g carbs</span>
                <span style="background:#d1fae5;color:#065f46;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;">🥑 ${day.fat}g fat</span>
              </div>
            </div>
  
            ${day.meals?.map(meal => `
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;">
                <span style="font-size:11px;font-weight:700;color:#6b8f71;text-transform:uppercase;letter-spacing:0.05em;">${meal.type}</span>
                <h3 style="font-size:15px;font-weight:700;color:#2d4a3e;margin:4px 0;">${meal.name}</h3>
                <p style="font-size:12px;color:#6b7280;margin-bottom:12px;">${meal.description}</p>
                
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;">
                  <div style="text-align:center;padding:8px;border-radius:10px;background:#fef3c7;">
                    <div style="font-size:12px;font-weight:700;color:#92400e;">${meal.calories}</div>
                    <div style="font-size:10px;color:#92400e;">kcal</div>
                  </div>
                  <div style="text-align:center;padding:8px;border-radius:10px;background:#dbeafe;">
                    <div style="font-size:12px;font-weight:700;color:#1e40af;">${meal.protein}g</div>
                    <div style="font-size:10px;color:#1e40af;">protein</div>
                  </div>
                  <div style="text-align:center;padding:8px;border-radius:10px;background:#fce7f3;">
                    <div style="font-size:12px;font-weight:700;color:#9d174d;">${meal.carbs}g</div>
                    <div style="font-size:10px;color:#9d174d;">carbs</div>
                  </div>
                  <div style="text-align:center;padding:8px;border-radius:10px;background:#d1fae5;">
                    <div style="font-size:12px;font-weight:700;color:#065f46;">${meal.fat}g</div>
                    <div style="font-size:10px;color:#065f46;">fat</div>
                  </div>
                </div>
  
                ${meal.ingredients?.length > 0 ? `
                  <div>
                    <p style="font-size:12px;font-weight:600;color:#2d4a3e;margin-bottom:6px;">📋 Ingredients:</p>
                    <div style="display:flex;flex-wrap:wrap;gap:4px;">
                      ${meal.ingredients.map(ing => `
                        <span style="font-size:11px;padding:3px 10px;border-radius:100px;background:#f0f7f1;color:#2d4a3e;border:1px solid #d1fae5;">${ing.name} — ${ing.amount}</span>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
                <p style="font-size:11px;color:#9ca3af;margin-top:8px;">⏱ ~${meal.prepTime} mins</p>
              </div>
            `).join('')}
  
            ${day.whyThisWorks ? `
              <div style="background:linear-gradient(135deg,#f0faf2,#e8f5ea);border-radius:12px;padding:14px 18px;border:1px solid #d1fae5;">
                <p style="font-size:11px;font-weight:700;color:#2d7d46;margin-bottom:4px;">✨ WHY THIS WORKS FOR YOU</p>
                <p style="font-size:13px;color:#2d4a3e;line-height:1.6;">${day.whyThisWorks}</p>
              </div>
            ` : ''}
          </div>
        `).join('')}
  
        ${plan.groceryList?.length > 0 ? `
          <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;">
            <h2 style="font-size:18px;font-weight:700;color:#2d4a3e;margin-bottom:16px;">🛒 Weekly Grocery List</h2>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${plan.groceryList.map(item => `
                <span style="font-size:12px;padding:6px 14px;border-radius:100px;background:#f0f7f1;color:#2d4a3e;border:1px solid #d1fae5;">
                  ${typeof item === 'object' ? `${item.item} — ${item.amount}` : item}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      `
  
      document.body.appendChild(printDiv)
  
      const canvas = await html2canvas(printDiv, {
        scale: 2,
        backgroundColor: '#f5f0e8',
        width: 800,
        windowWidth: 800
      })
  
      document.body.removeChild(printDiv)
  
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      let heightLeft = pdfHeight
      let position = 0
  
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()
  
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= pdf.internal.pageSize.getHeight()
      }
  
      pdf.save('DietX-MealPlan.pdf')
  
    } catch (err) {
      console.error('Export error:', err)
      alert('Export failed: ' + err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f0e8' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 60%, #52b788 100%)',
        padding: '40px 24px 60px'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
            padding: '8px 18px', borderRadius: '100px', fontSize: '14px',
            cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            ← Back
          </button>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: '700', color: 'white', marginBottom: '12px' }}>
            Your 7-Day Meal Plan 📋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: '1.7' }}>
            {plan.summary}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div id="meal-plan-content" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Grocery List */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', marginBottom: '20px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setGroceryOpen(!groceryOpen)}
            style={{
              width: '100%', background: 'none', border: 'none', padding: '20px 24px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: '#f0f7f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}>🛒</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: '700', fontSize: '16px', color: '#2d4a3e' }}>Grocery List</p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>{plan.groceryList?.length} items for the week</p>
              </div>
            </div>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', background: '#f0f7f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#2d4a3e',
              transform: groceryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease'
            }}>▼</div>
          </button>

          {groceryOpen && (
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {plan.groceryList.map((item, i) => (
                  <span key={i} style={{
                    fontSize: '12px', padding: '6px 12px', borderRadius: '100px',
                    backgroundColor: '#f0f7f1', color: '#2d4a3e', border: '1px solid #d1fae5'
                  }}>
                    {typeof item === 'object' ? `${item.item} — ${item.amount}` : item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Day Cards */}
        {plan.days?.map((day, i) => (
          <DayCard key={i} dayData={day} index={i} />
        ))}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 32px', borderRadius: '12px', border: 'none',
              backgroundColor: '#2d7d46', color: 'white', fontWeight: '600',
              fontSize: '15px', cursor: 'pointer'
            }}
          >
            ✨ Regenerate Plan
          </button>
          <button
            onClick={exportPDF}
            style={{
              padding: '12px 32px', borderRadius: '12px', border: '2px solid #2d7d46',
              backgroundColor: '#ffffff', color: '#2d7d46', fontWeight: '600',
              fontSize: '15px', cursor: 'pointer'
            }}
          >
            📄 Export PDF
          </button>
        </div>

      </div>
    </div>
  )
}