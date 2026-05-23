export const labelStyle = { fontWeight: 'bold', color: '#ffffff', fontSize: '13px', display: 'block', marginBottom: '5px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' };

export const inputStyle = (error) => ({
    width: '100%', padding: '12px 15px', marginBottom: '15px', boxSizing: 'border-box',
    border: error ? '2px solid #ff8a80' : '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '10px',
    outline: 'none', fontSize: '15px', transition: 'all 0.3s', backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff'
});

export const btnSubmitStyle = (disabled) => ({
    width: '100%', padding: '15px', marginTop: '10px', backgroundColor: disabled ? 'rgba(255,255,255,0.3)' : '#00A8CC',
    color: '#ffffff', border: 'none', borderRadius: '10px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '900', fontSize: '15px', letterSpacing: '1px', transition: 'all 0.3s', boxShadow: disabled ? 'none' : '0 4px 15px rgba(0, 168, 204, 0.4)'
});

export const btnCancelStyle = {
    width: '100%', padding: '10px', marginTop: '15px', background: 'transparent', color: '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
};
