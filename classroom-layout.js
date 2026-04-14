/**
 * Fast klassrumslayout enligt given skiss.
 * Fram i klassrummet = högst upp i vyn.
 */
export const classroomLayout = {
  id: 'klassrum-fast-layout-v2',
  zones: ['left', 'middle', 'right', 'back'],
  oppositeSides: {
    left: 'right',
    right: 'left'
  },
  seats: [
    // Vänster block (01-09)
    { id: '01', label: '01', zone: 'left', section: 'leftBlock', row: 1, col: 1 },
    { id: '02', label: '02', zone: 'left', section: 'leftBlock', row: 1, col: 2 },
    { id: '03', label: '03', zone: 'left', section: 'leftBlock', row: 1, col: 3 },
    { id: '04', label: '04', zone: 'left', section: 'leftBlock', row: 2, col: 1 },
    { id: '05', label: '05', zone: 'left', section: 'leftBlock', row: 2, col: 2 },
    { id: '06', label: '06', zone: 'left', section: 'leftBlock', row: 2, col: 3 },
    { id: '07', label: '07', zone: 'left', section: 'leftBlock', row: 3, col: 1 },
    { id: '08', label: '08', zone: 'left', section: 'leftBlock', row: 3, col: 2 },
    { id: '09', label: '09', zone: 'left', section: 'leftBlock', row: 3, col: 3 },

    // Mittenblock (10-15)
    { id: '10', label: '10', zone: 'middle', section: 'middleBlock', row: 1, col: 1 },
    { id: '11', label: '11', zone: 'middle', section: 'middleBlock', row: 1, col: 2 },
    { id: '12', label: '12', zone: 'middle', section: 'middleBlock', row: 2, col: 1 },
    { id: '13', label: '13', zone: 'middle', section: 'middleBlock', row: 2, col: 2 },
    { id: '14', label: '14', zone: 'middle', section: 'middleBlock', row: 3, col: 1 },
    { id: '15', label: '15', zone: 'middle', section: 'middleBlock', row: 3, col: 2 },

    // Höger block (16-24)
    { id: '16', label: '16', zone: 'right', section: 'rightBlock', row: 1, col: 1 },
    { id: '17', label: '17', zone: 'right', section: 'rightBlock', row: 1, col: 2 },
    { id: '18', label: '18', zone: 'right', section: 'rightBlock', row: 1, col: 3 },
    { id: '19', label: '19', zone: 'right', section: 'rightBlock', row: 2, col: 1 },
    { id: '20', label: '20', zone: 'right', section: 'rightBlock', row: 2, col: 2 },
    { id: '21', label: '21', zone: 'right', section: 'rightBlock', row: 2, col: 3 },
    { id: '22', label: '22', zone: 'right', section: 'rightBlock', row: 3, col: 1 },
    { id: '23', label: '23', zone: 'right', section: 'rightBlock', row: 3, col: 2 },
    { id: '24', label: '24', zone: 'right', section: 'rightBlock', row: 3, col: 3 },

    // Bakre rad (25-28)
    { id: '25', label: '25', zone: 'back', section: 'backRow', row: 1, col: 1 },
    { id: '26', label: '26', zone: 'back', section: 'backRow', row: 1, col: 2 },
    { id: '27', label: '27', zone: 'back', section: 'backRow', row: 1, col: 3 },
    { id: '28', label: '28', zone: 'back', section: 'backRow', row: 1, col: 4 }
  ]
};
