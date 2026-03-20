class Team {
  constructor(name, group = null) {
    this.name = name;
    this.group = group;
  }
}

class Match {
  constructor(homeTeam, awayTeam, homeGoals, awayGoals, matchday) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.homeGoals = homeGoals;
    this.awayGoals = awayGoals;
    this.matchday = matchday;
  }

  getResult() {
    if (this.homeGoals > this.awayGoals) return 'home';
    if (this.awayGoals > this.homeGoals) return 'away';
    return 'draw';
  }

  getTotalGoals() {
    return this.homeGoals + this.awayGoals;
  }

  involvesTeam(teamName) {
    return this.homeTeam === teamName || this.awayTeam === teamName;
  }
}

class Tournament {
  constructor(name) {
    this.name = name;
    this.teams = [];
    this.matches = [];
  }

  addTeam(name, group = null) {
    const exists = this.teams.some(t => t.name === name);
    if (!exists) {
      this.teams.push(new Team(name, group));
    }
  }

  recordMatch(homeTeam, awayTeam, homeGoals, awayGoals, matchday) {
    this.matches.push(new Match(homeTeam, awayTeam, homeGoals, awayGoals, matchday));
  }

  getMatchesByMatchday(matchday) {
    return this.matches.filter(m => m.matchday === matchday);
  }

  getMatchesByTeam(teamName) {
    return this.matches.filter(m => m.involvesTeam(teamName));
  }

  getTeamStats(teamName) {
    const team = this.teams.find(t => t.name === teamName);
    if (!team) return null;

    const teamMatches = this.getMatchesByTeam(teamName);

    const stats = teamMatches.reduce(
      (acc, match) => {
        const isHome = match.homeTeam === teamName;
        const goalsFor = isHome ? match.homeGoals : match.awayGoals;
        const goalsAgainst = isHome ? match.awayGoals : match.homeGoals;
        const result = match.getResult();
        const won = (result === 'home' && isHome) || (result === 'away' && !isHome);
        const drawn = result === 'draw';

        acc.played += 1;
        acc.goalsFor += goalsFor;
        acc.goalsAgainst += goalsAgainst;
        if (won) {
          acc.won += 1;
          acc.points += 2;
        } else if (drawn) {
          acc.drawn += 1;
          acc.points += 1;
        } else {
          acc.lost += 1;
        }
        return acc;
      },
      { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
    );

    return {
      name: teamName,
      group: team.group,
      ...stats,
      goalDifference: stats.goalsFor - stats.goalsAgainst,
    };
  }

  getStandings(group = null) {
    let teams = this.teams;
    if (group !== null) {
      teams = teams.filter(t => t.group === group);
    }

    return teams
      .map(t => this.getTeamStats(t.name))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });
  }

  getTotalGoals() {
    return this.matches.reduce((sum, m) => sum + m.getTotalGoals(), 0);
  }

  getAverageGoalsPerMatch() {
    if (this.matches.length === 0) return 0;
    return this.getTotalGoals() / this.matches.length;
  }

  getHighestScoringMatch() {
    if (this.matches.length === 0) return null;
    return [...this.matches].sort((a, b) => b.getTotalGoals() - a.getTotalGoals())[0];
  }

  getBestAttack() {
    const standings = this.getStandings();
    return standings.sort((a, b) => b.goalsFor - a.goalsFor)[0].name;
  }

  getBestDefense() {
    const standings = this.getStandings();
    return standings.sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0].name;
  }

  getUnbeatenTeams() {
    return this.teams
      .filter(t => {
        const stats = this.getTeamStats(t.name);
        return stats.lost === 0 && stats.played > 0;
      })
      .map(t => t.name);
  }

  getTeamsWithoutWin() {
    return this.teams
      .filter(t => {
        const stats = this.getTeamStats(t.name);
        return stats.won === 0 && stats.played > 0;
      })
      .map(t => t.name);
  }

  getHeadToHead(team1, team2) {
    return this.matches.filter(
      m =>
        (m.homeTeam === team1 && m.awayTeam === team2) ||
        (m.homeTeam === team2 && m.awayTeam === team1)
    );
  }

  getTopTeams(n) {
    return this.getStandings().slice(0, n);
  }
}

module.exports = { Team, Match, Tournament };
