/**
 * Layouten ska ersättas med den faktiska skissen när den finns tillgänglig.
 * Varje plats måste ha en exakt zon/sida som stöder regeln om motsatta sidor.
 */
export const classroomLayout = {
  id: 'placeholder-layout-v1',
  sides: ['left', 'right'],
  oppositeSides: {
    left: 'right',
    right: 'left'
  },
  seats: [
    { id: 'A1', label: 'A1', zone: 'left', row: 1, col: 1 },
    { id: 'A2', label: 'A2', zone: 'left', row: 1, col: 2 },
    { id: 'A3', label: 'A3', zone: 'left', row: 2, col: 1 },
    { id: 'A4', label: 'A4', zone: 'left', row: 2, col: 2 },
    { id: 'B1', label: 'B1', zone: 'right', row: 1, col: 5 },
    { id: 'B2', label: 'B2', zone: 'right', row: 1, col: 6 },
    { id: 'B3', label: 'B3', zone: 'right', row: 2, col: 5 },
    { id: 'B4', label: 'B4', zone: 'right', row: 2, col: 6 }
  ]
};
