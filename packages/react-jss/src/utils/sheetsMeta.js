const sheetsMeta = new WeakMap()

export const getMeta = (sheet) => sheetsMeta.get(sheet)

export const addMeta = (sheet, meta) => {
  sheetsMeta.set(sheet, meta)
}
