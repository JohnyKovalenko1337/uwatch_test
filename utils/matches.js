const axios = require("axios");

exports.matches = async () => {
  try {
    const result = await axios({
      url: "https://uwatch.live/graphql",
      method: "post",
      data: {
        query: `
              query getMatchesList($id: ID!, $status: MatchStatus, $game: String, $paging: PagingInput) {
                project(id: $id, isPublic: true) {
                  id
                  matches(status: $status, game: $game, paging: $paging) {
                    items {
                      id
                      startedAt
                      tournamentName
                      opponent {
                        shortName
                        id
                        logo
                        name
                      }
                      player {
                        id
                        shortName
                        logo
                        name
                      }
                      status
                    } 
                  }
                }
              }
              
                `,
        variables: {
          id: "1",
        },
      },
    });
    return result.data.data.project.matches;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch matches");
  }
};
