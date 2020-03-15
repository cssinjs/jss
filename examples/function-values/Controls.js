import React from 'react'

export default ({onAdd, amount, onChangeRenderer}) => (
  <div>
    <form style={{marginBottom: 10}}>
      <label htmlFor="renderer" style={{marginRight: 10}}>
        Render using:
        <select id="renderer" onChange={onChangeRenderer} defaultValue="jss">
          <option value="jss">Pure JSS</option>
          <option value="react-jss">React-JSS</option>
          <option value="inline">React Inline Styles</option>
        </select>
      </label>
    </form>
    <form>
      <input readOnly value={`${amount} objects`} style={{marginRight: 10}} />
      <button type="button" onClick={onAdd}>
        Render 30 more
      </button>
    </form>
  </div>
)
