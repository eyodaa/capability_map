const AddCapabilityForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 1, // 1: Parent, 2: Sub, 3: Sub-Sub
    parentId: null, // Required if Level is 2 or 3
    maturity: 3
  });

  return (
    <div className="add-form-container">
      <h3>New Capability</h3>
      
      <label>Level</label>
      <select 
        value={formData.level} 
        onChange={(e) => setFormData({...formData, level: e.target.value})}
      >
        <option value={1}>Level 1 (Parent)</option>
        <option value={2}>Level 2 (Sub-Capability)</option>
        <option value={3}>Level 3 (Sub-Sub Capability)</option>
      </select>

      {/* Only show Parent Selection if adding a Child */}
      {formData.level > 1 && (
        <>
          <label>Select Parent</label>
          <select onChange={(e) => setFormData({...formData, parentId: e.target.value})}>
            {/* Map through existing capabilities based on level */}
          </select>
        </>
      )}

      <label>Capability Name</label>
      <input 
        type="text" 
        placeholder="e.g. MSME Lending" 
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
      />

      <label>Objective/Description</label>
      <textarea onChange={(e) => setFormData({...formData, description: e.target.value})} />

      <button className="btn-save">Save to Database</button>
    </div>
  );
};