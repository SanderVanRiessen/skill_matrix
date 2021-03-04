(() => ({
  name: 'datatable',
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
      Checkbox,
    } = window.MaterialUI.Core;
    const { DataGrid, GridToolbar } = window.MaterialUI.Datagrid;
    const { XGrid } = window.MaterialUI.XGrid;

    const isDev = env === 'dev';

    const GET_USERINFO = gql`
      query Items {
        allUser {
          results {
            id
            name
            userskills {
              status
              isMastered
              skill {
                id
                name
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

    // function columns(skillsResults) {
    //   return (
    //     { field: 'name', headerName: 'name', width: 70 },
    //     { field: 'Team/Jobs', headerName: 'Team/Jobs', width: 130 },
    //     array.map(skill => ({
    //       field: skill.name,
    //       headerName: skill.name,
    //       width: 130,
    //     }))
    //   );
    // }

    const columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'name', width: 200 },
      {
        field: 'teamjobs',
        headerName: 'Team/Jobs',
        width: 130,
      },
    ];
    const row = [];

    function Skill({ value }) {
      if (value) return <div>{value} S</div>;
      return <div>No skill</div>;
    }

    function table() {
      return (
        <Query
          fetchPolicy="network-only"
          query={GET_USERINFO}
          pollInterval={1000}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
            const {
              allUser: { results: userResults },
              allSkills: { results: skillsResults },
            } = data;
            skillsResults.forEach(element => {
              columns.push({
                field: element.id,
                headerName: element.name,
                renderCell: params => <Skill value={params.value} />,
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
                teamjobs: element.userteamjobs.map(team => team.teamjob.name),
              };

              ar.forEach(id => {
                const usk = element.userskills.find(el => el.skill.id == id);

                rowObject[id] = usk;
              });

              console.log('Row object', rowObject);

              row.push(rowObject);
            });

            console.log('Row', row);

            return (
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={row}
                  columns={columns}
                  pageSize={5}
                  components={{
                    Toolbar: GridToolbar,
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
    };
  },
}))();
