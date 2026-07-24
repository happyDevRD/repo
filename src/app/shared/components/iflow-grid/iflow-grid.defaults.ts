import { jqxGrid_ES } from 'src/translations/jqxGrid_translate'
import { IflowGridLocalization } from './iflow-grid.types'

/** Defaults corporativos del wrapper app-iflow-grid. */
export const IFLOW_GRID_DEFAULTS = {
  width: '100%' as string | number,
  pagesize: 10,
  pagesizeoptions: ['5', '10', '20'] as (string | number)[],
  pageable: true,
  sortable: true,
  filterable: true,
  altrows: true,
  autoheight: true,
  columnsautoresize: true,
  columnsresize: false,
  selectionmode: 'singlerow',
  editmode: 'selectedcell',
  localization: jqxGrid_ES as IflowGridLocalization,
}