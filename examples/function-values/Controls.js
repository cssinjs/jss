import React from 'react'

export default ({onAdd, amount, classes, onChangeRenderer}) => (
  <div>
    <form style={{marginBottom: 10}}>
      <label style={{marginRight: 10}}>Render using:</label>
      <select onChange={onChangeRenderer} defaultValue="jss">
        <option value="jss">Pure JSS</option>
        <option value="react-jss">React-JSS</option>
        <option value="inline">React Inline Styles</option>
      </select>
    </form>
    <form>
      <input readOnly value={`${amount} objects`} style={{marginRight: 10}} />
      <button onClick={onAdd}>Render 30 more</button>
    </form>
  </div>
)
