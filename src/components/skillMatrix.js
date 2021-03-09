(() => ({
  name: 'skillMatrix',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { gql } = window;
    const { GetAll, Query, env } = B;
    const {
      Table,
      TableCell,
      TableHead,
      TableRow,
      TableBody,
      IconButton,
      Checkbox: CheckFilter,
    } = window.MaterialUI.Core;

    const { Rating } = window.MaterialUI.Lab;
    const {
      XGrid,
      getGridNumericColumnOperators,
      GridPreferencePanelsValue,
    } = window.MaterialUI.XGrid;

    const {
      Info,
      CheckBox: CheckBoxIcon,
      CheckBoxOutlineBlank,
    } = window.MaterialUI.Icons;

    const [gridRef, setGridRef] = useState(false);

    const isDev = env === 'dev';

    useEffect(() => {
      if (gridRef) {
        var parentElement = document.getElementsByClassName('MuiDataGrid-main');
        parentElement[0].children[0].style.display = 'none';
      }
    }, [gridRef]);

    const GET_USERINFO = gql`
      query Items {
        allUser {
          results {
            id
            name
            userskills {
              id
              status
              isMastered
              masteredSubskillCount
              skill {
                id
                name
                subskillCount
                subskills {
                  id
                  name
                  status
                }
              }
            }
            userteamjobs {
              teamjob {
                id
                name
              }
            }
          }
        }
        allSkills {
          results {
            id
            name
          }
        }
      }
    `;

    function Skill({ value }) {
      if (value)
        return (
          <div className={classes.cell}>
            {value.isMastered ? (
              <CheckBoxIcon
                className={[classes.check, classes.mastered].join(' ')}
              />
            ) : (
              <CheckBoxOutlineBlank
                className={[classes.check, classes.learning].join(' ')}
              />
            )}
            {value.masteredSubskillCount + '/' + value.skill.subskillCount}
            <IconButton
              onClick={() => B.triggerEvent('onClickSkill', value.id)}
            >
              <Info
                className={[
                  value.isMastered ? classes.mastered : classes.learning,
                ].join(' ')}
              />
            </IconButton>
          </div>
        );
      return (
        <div className={classes.cell}>
          <CheckBoxOutlineBlank className={classes.check} />
        </div>
      );
    }

    function isMastered(value) {
      if (value && value.isMastered) {
        return true;
      }
      return false;
    }

    function SkillInputValue(props) {
      const { item, applyValue } = props;
      const handleFilterChange = event => {
        applyValue({ ...item, value: event.target.checked });
      };

      return (
        <div>
          <CheckFilter onChange={handleFilterChange} />
        </div>
      );
    }

    function table() {
      return (
        <Query fetchPolicy="network-only" query={GET_USERINFO}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            const {
              allUser: { results: userResults },
              allSkills: { results: skillsResults },
            } = data;

            const columns = [
              { field: 'name', headerName: 'name', width: 200 },
              {
                field: 'teamjobs',
                headerName: 'Team/Jobs',
                width: 130,
              },
            ];

            const row = [];

            skillsResults.forEach(element => {
              const width = element.name.length * 7 + 50;
              columns.push({
                field: element.id,
                headerName: element.name,
                valueGetter: params => isMastered(params.value),
                renderCell: params => <Skill value={params.value} />,
                width: width < 120 ? 120 : width,
              });
            });

            const ar = [];
            skillsResults.forEach(element => {
              ar.push(element.id);
            });

            userResults.forEach(element => {
              const rowObject = {
                id: element.id,
                name: element.name,
                teamjobs:
                  element.userteamjobs.length > 0
                    ? element.userteamjobs[0].teamjob.name
                    : 'No Job',
              };

              ar.forEach(id => {
                const usk = element.userskills.find(el => el.skill.id == id);

                if (usk) {
                  return (rowObject[id] = usk);
                } else {
                  return 'undifined';
                }
              });
              row.push(rowObject);

              columns.forEach(column => {
                if (typeof column.field === 'number') {
                  const skillColumn = columns.find(
                    findcolumn => findcolumn.field === column.field,
                  );
                  const skillColIndex = columns.findIndex(
                    indexcol => indexcol.field === column.field,
                  );

                  const ratingFilterOperators = getGridNumericColumnOperators().map(
                    operator => ({
                      ...operator,
                      InputComponent: SkillInputValue,
                    }),
                  );

                  columns[skillColIndex] = {
                    ...skillColumn,
                    filterOperators: ratingFilterOperators,
                  };
                }
              });
            });

            return (
              <div style={{ height: 400, width: '100%' }}>
                <XGrid
                  ref={el => setGridRef(el)}
                  rows={row}
                  columns={columns}
                  state={{
                    preferencePanel: {
                      openedPanelValue: GridPreferencePanelsValue.filters,
                    },
                  }}
                />
              </div>
            );
          }}
        </Query>
      );
    }

    return isDev ? (
      <div className={classes.placeholder}>User skills</div>
    ) : (
      table()
    );
  })(),
  styles: B => theme => {
    const style = new B.Styling(theme);
    return {
      root: {
        textAlign: 'left',
      },
      placeholder: {
        padding: '10px',
      },
      cell: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        width: '100%',
      },
      check: {
        marginRight: '10px',
        color: 'grey',
      },
      mastered: {
        color: ({ options: { masteredColor } }) =>
          style.getColor(masteredColor),
      },
      learning: {
        color: ({ options: { learningColor } }) =>
          style.getColor(learningColor),
      },
    };
  },
}))();
