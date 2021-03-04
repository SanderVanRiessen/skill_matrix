(() => ({
  name: 'skillsMatrix',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { gql, useQuery } = window;
    const { modelId, filter } = options;
    const { Query, GetAll } = B;
    const {
      Table,
      TableCell,
      TableHead,
      TableRow,
      TableBody,
      Checkbox,
    } = window.MaterialUI.Core;
    // const { XGrid } = window.MaterialUI.XGrid;
    // const [filterIdList, setFilterIdList] = useState(null);
    // const [userResults, setUserResults] = useState(null);
    // setFilterIdList([1, 4]);

    const GET_USERINFO = gql`
      query Items {
        allUser(where: { userskills: { status: { eq: "Mastered" } } }) {
          results {
            name
            userskills {
              skills {
                id
                name
                subskills {
                  name
                  status
                }
              }
            }
            userteamjobs {
              teamjob {
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

    const GET_FILTER = gql`
      query Items {
        allUser(
          where: { userskills: { skills: { name: { eq: "schaken" } } } }
        ) {
          results {
            name
            userskills {
              skills {
                name
                subskills {
                  name
                  status
                }
              }
            }
            userteamjobs {
              teamjob {
                name
              }
            }
          }
        }
        allSkills {
          results {
            name
          }
        }
      }
    `;

    function User(props) {
      const {
        item,
        item: {
          name,
          userskills: {
            skill: {
              Name: skillName,
              subskills: { name: subskillName, status: subskilStatus },
            },
          },
          userteamjobs: {
            teamjob: { name: teamjobName },
          },
        },
      } = props;

      return (
        <div className={classes.root}>
          <table>
            <tr>
              <th>Filter</th>
              <th>All</th>
              <th key={name}>
                <input type="checkbox" checked={false} />
              </th>
            </tr>
            <tr>
              <th>Naam</th>
              <th>Team/Job</th>
              <th key={teamjob}>{teamjob}</th>
            </tr>
            <tr>
              {/* Get from User */}
              <td key={name}>{name}</td>
              {/* Get from Team/Job */}
              <td key={teamjob}>{teamjob}</td>
              {/* Get from UserSkill */}
              <td key={teamjob}>
                <input type="checkbox" checked={true} />
              </td>
            </tr>
          </table>
        </div>
      );
    }

    function Test(props) {
      const {
        item,
        item: { name },
      } = props;
      return (
        <div className={classes.root}>
          <table>
            <tr>
              <th>Filter</th>
              <th>All</th>
              <th key={name}>
                <input type="checkbox" checked={false} />
              </th>
            </tr>
            <tr>
              <th>Naam</th>
              <th>Team/Job</th>
              <th key={name}>{name}</th>
            </tr>
            <tr>
              {/* Get from User */}
              <td key={name}>{name}</td>
              {/* Get from Team/Job */}
              <td key={name}>{name}</td>
              {/* Get from UserSkill */}
              <td key={name}>
                <input type="checkbox" checked={true} />
              </td>
            </tr>
          </table>
        </div>
      );
    }

    function skills() {
      return (
        <div className={classes.root}>
          <Query fetchPolicy="network-only" query={GET_SKILLS}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              const {
                allSkills: { results },
              } = data;
              console.log(results);
              //return results.map(item => <Test key={item.id} item={results} />);
              const list = results.map(result => (
                <TableCell>{result.name}</TableCell>
              ));

              return list;
            }}
          </Query>
        </div>
      );
    }

    function userlist() {
      return (
        <div className={classes.root}>
          <Query fetchPolicy="network-only" query={GET_USERINFO}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              const {
                allUser: { results: userResults },
                allSkills: { results: skillsResults },
              } = data;
              console.log(results);
              //return results.map(item => <Test key={item.id} item={results} />);
              //const list = skills.map(result => <th>{result.name}</th>);
              const ulist = results.map(result => (
                <TableRow>
                  <TableCell>{result.name}</TableCell>
                  <TableCell>
                    {result.userteamjobs.map(item => {
                      return item.teamjob.name;
                    })}
                  </TableCell>
                  {/* {result.userteamjobs.map(item => (
                    <TableCell>{item.teamjob.name}</TableCell>
                  ))} */}
                  <TableCell>
                    {result.userskills.map(skil => {
                      return skil.skills.name;
                    })}
                  </TableCell>
                  {/* {result.userskills.map(skil => (
                    <TableCell>{skil.skills.name}</TableCell>
                  ))} */}
                </TableRow>
              ));
              const qlist = data.allUser.results.map(q => {
                console.log(q);
              });

              return (
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Naam</TableCell>
                      <TableCell>Team/Job</TableCell>
                      {skills()}
                    </TableRow>
                  </TableHead>
                  <TableBody>{ulist}</TableBody>
                  {qlist}
                </Table>
              );
            }}
          </Query>
        </div>
      );
    }

    function Fcfilter(skill) {
      console.log(skill);
      console.log(skillId);
      skill = parseInt(skill);
      if (skillId.includes(skill)) {
        for (var i = 0; i < skillId.length; i++) {
          if (skillId[i] === skill) {
            skillId.splice(i, 1);
          }
        }
      } else {
        skillId.push(skill);
      }
      console.log(skillId);
    }

    function spliceArray(array) {
      if (array.length <= 0) {
      } else {
        //var str = new RegExp(array.join('||'));
        var str = array.join('||');
        var text = 1;
        console.log(Number(str));
      }
    }

    function table() {
      return (
        <div className={classes.root}>
          <Query
            fetchPolicy="network-only"
            query={GET_USERINFO}
            pollInterval={1000}
          >
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;

              console.log(data);
              const tablehead = (
                <TableHead>
                  <TableRow>
                    <TableCell>Filter</TableCell>
                    <TableCell>All</TableCell>
                    {data.allSkills.results.map(skill => (
                      <TableCell>
                        <Checkbox
                          onChange={event => Fcfilter(event.target.value)}
                          //onChange={() => refetch()}
                          value={skill.id}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>Naam</TableCell>
                    <TableCell>Team/Job</TableCell>
                    {data.allSkills.results.map(skill => (
                      <TableCell>{skill.name}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
              );

              const users = (
                <TableBody>
                  {data.allUser.results
                    // .filter(user => {
                    //   const userSkillId = user.userskills.map(
                    //     skill => skill.skills.id,
                    //   );
                    //   let counter = 0;
                    //   skillId.forEach(id => {
                    //     if (userSkillId.includes(id)) counter++;
                    //   });
                    //   console.log(skillId.length == counter);
                    //   return skillId.length == counter;
                    // })
                    .map(user => (
                      <TableRow>
                        <TableCell>{user.name}</TableCell>
                        {/* {user.userteamjobs.map(team => {
                        <TableCell>{team.teamjob.name}</TableCell>;
                      })} */}
                        <TableCell>
                          {user.userteamjobs.map(team => {
                            return team.teamjob.name;
                          })}
                        </TableCell>
                        {/* {user.userskills.map(skills => (
                        <TableCell>{skills.skills.name}</TableCell>
                      ))} */}
                        {data.allSkills.results.map(skill => {
                          //console.log(user.userskills);
                          const us = [];
                          user.userskills.map(uskills => {
                            // console.log(uskills.skills.id);
                            // console.log(uskills.skills.name);

                            us.push(uskills.skills.name);

                            // const isInArray = skill.name.includes(
                            //   uskills.skills.name,
                            // );
                            //return isInArray;
                            // console.log(isInArray);
                          });

                          for (let j = 0; j < us.length; j++) {
                            if (skill.name === us[j]) {
                              return (
                                <TableCell>
                                  <Checkbox disabled checked />
                                </TableCell>
                              );
                            }
                          }
                          return (
                            <TableCell>
                              <Checkbox disabled />
                            </TableCell>
                          );

                          //console.log(array);
                          //const cod = skill.name;

                          //const found = skill.name.includes(us);

                          //console.log(skill.name);

                          // const isInArray =
                          //   skill.name.indexOf(user.userskills.skills.name) > -1;
                          //console.log(skill);
                          //console.log(user.userskills);
                          //console.log(arrayin);
                          //console.log(found);
                          //console.log(cod);
                          // if (true) {
                          //   return (
                          //     <TableCell>
                          //       <Checkbox disabled checked />
                          //     </TableCell>
                          //   );
                          // }
                          // return (
                          //   <TableCell>
                          //     <Checkbox disabled />
                          //   </TableCell>
                          // );
                          // <TableCell>{skill.name}</TableCell>;
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              );

              return (
                <Table className={classes.table}>
                  {tablehead}
                  {users}

                  {/* <TableHead>
                    <TableRow>
                      <TableCell>Naam</TableCell>
                      <TableCell>Team/Job</TableCell>
                      {skills()}
                    </TableRow>
                  </TableHead>
                  <TableBody>{ulist}</TableBody> */}
                  {/* {qlist} */}
                </Table>
              );
            }}
          </Query>
        </div>
      );
    }

    function matrix() {
      const { data, loading, error } = useQuery(GET_USERINFO);

      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;
      const tablehead = (
        <TableHead>
          <TableRow>
            <TableCell>Filter</TableCell>
            <TableCell>All</TableCell>
            {data.allSkills.results.map(skill => (
              <TableCell>
                <Checkbox
                  onChange={event => Fcfilter(event.target.value)}
                  value={skill.id}
                />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Naam</TableCell>
            <TableCell>Team/Job</TableCell>
            {data.allSkills.results.map(skill => (
              <TableCell>{skill.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
      );

      const users = (
        <TableBody>
          {data.allUser.results
            .filter(user => {
              const userSkillId = user.userskills.map(skill => skill.skills.id);
              let counter = 0;
              skillId.forEach(id => {
                if (userSkillId.includes(id)) counter++;
              });
              console.log(skillId.length == counter);
              return skillId.length == counter;
            })
            .map(user => (
              <TableRow>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  {user.userteamjobs.map(team => {
                    return team.teamjob.name;
                  })}
                </TableCell>
                {data.allSkills.results.map(skill => {
                  const us = [];
                  user.userskills.map(uskills => {
                    us.push(uskills.skills.name);
                  });

                  for (let j = 0; j < us.length; j++) {
                    if (skill.name === us[j]) {
                      return (
                        <TableCell>
                          <Checkbox disabled checked />
                        </TableCell>
                      );
                    }
                  }
                  return (
                    <TableCell>
                      <Checkbox disabled />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      );

      return (
        <Table className={classes.table}>
          {tablehead}
          {users}
        </Table>
      );
    }

    function grid() {
      const { data } = GET_USERINFO;
      return (
        <div>
          <XGrid {...data} />
        </div>
      );
    }

    return table();
    // <div>
    //   <GetAll modelId={modelId} filter={filter} skip={0} take={15}>
    //     {({ loading, error, data, refetch }) => {
    //       if (loading) {
    //         return <span>Loading...</span>;
    //       }

    //       if (error) {
    //         return <span>Something went wrong: {error.message} :(</span>;
    //       }

    //       const { totalCount, results } = data;
    //       return (
    //         <div className={classes.root}>
    //           <table>
    //             <tr>
    //               <th>Filter</th>
    //               <th>All</th>
    //               {results.map(item => (
    //                 <th key={item.id}>
    //                   <input type="checkbox" checked={false} />
    //                 </th>
    //               ))}
    //             </tr>
    //             <tr>
    //               <th>Naam</th>
    //               <th>Team/Job</th>
    //               {results.map(item => (
    //                 <th key={item.id}>{item.name}</th>
    //               ))}
    //             </tr>
    //             {results.map(item => (
    //               <tr>
    //                 {/* Get from User */}
    //                 <td key={item.id}>{item.name}</td>
    //                 {/* Get from Team/Job */}
    //                 <td key={item.id}>Functienamen hier!</td>
    //                 {/* Get from UserSkill */}
    //                 {results.map(item => (
    //                   <td key={item.id}>
    //                     <input type="checkbox" checked={true} />
    //                   </td>
    //                 ))}
    //               </tr>
    //             ))}
    //           </table>
    //         </div>
    //       );
    //     }}
    //   </GetAll>
    // </div>
  })(),
  styles: B => theme => {
    const style = new B.Styling(theme);
    return {
      root: {
        textAlign: 'left',
      },
    };
  },
}))();
