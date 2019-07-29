//:D
// Author: Saúl Bensach
// Date: 29/07/2019

const Player = require('./player');

module.exports = class MatchSimulator {

    //Assists are not beign accounted

    constructor(max_rounds, overtime, max_players, player_name_prefix) {
        this.max_rounds = max_rounds;
        this.overtime = overtime;
        this.max_players = max_players;
        this.player_name_prefix = player_name_prefix;
        this.team1_rounds = 0;
        this.team2_rounds = 0;
        this.played_rounds = 0;
        this.bomb_defused = false;
        this.is_bomb_planted = false;
        this.players_team1 = []; // CT
        this.players_team2 = []; // T
        this.round_time = 10; //Number of ticks before round ends
        this.setup_match();
    }

    setup_match() {
        this.players_team1 = new Array(Math.floor(this.max_players / 2))
        .fill()
        .map((e, i) => new Player(this.player_name_prefix + (i+1)));

        this.players_team2 = new Array(Math.floor(this.max_players / 2))
        .fill()
        .map((e, i) => new Player(this.player_name_prefix + (i+1+Math.floor(this.max_players / 2))));
        this.simulate();
    }

    perform_team_action(team, enemies) {
        if(!this.bomb_defused) {
            team.filter(player => player.is_dead == false).forEach(player => {
                this.player_action(player, enemies);
            })
        }
        
    }

    simulate() {
        console.log("Round: "+(this.played_rounds + 1));
        //small chance for planting the bomb
        this.is_bomb_planted = this.getRandomInt(3) == 0 ? true : false;
        this.bomb_defused = false;
        // Each iteration is a tick in each tick, each player have the oportunity to deal damage
        // to other players, if all team2 is killed team1 have the rest of the ticks
        // for getting de prob for defusing the bomb (no ninja defuse)
        for(let i = 0; i < this.round_time; i++) {
            let val = this.getRandomInt(2) == 0 ? true : false;
            //give small chance to defuse the bomb if planted
            if(this.is_bomb_planted) {
                let val = this.getRandomInt(30);
                if(val == 0){
                    this.bomb_defused = true;
                    break;
                }
            }
            if(val == 0){
                this.perform_team_action(this.players_team1, this.players_team2);
                this.perform_team_action(this.players_team2, this.players_team1);
            } else {
                this.perform_team_action(this.players_team2, this.players_team1);
                this.perform_team_action(this.players_team1, this.players_team2);
            }
        }

        //if bomb is planted check if 
        if(this.is_bomb_planted) {
            if(this.bomb_defused){
                //CTs won
                console.log("Team1 wins the round!")
                this.team1_rounds++; 
            } else {
                //Bomb exploded
                console.log("Team2 wins the round!");
                this.team2_rounds++;
            }
        } else {
            //if bomb is not planted check if all CT were killed
            if(this.players_team1.filter(player => player.is_dead == false).length == 0){
                //All CTs were killed
                console.log("Team2 wins the round!");
                this.team2_rounds++;
            } else {
                console.log("Team1 wins the round!")
                this.team1_rounds++;
            }
        }

        console.log("team1");
        console.log(this.players_team1);
        console.log("team2");
        console.log(this.players_team2);

        this.played_rounds++;
        if(
            this.played_rounds >= this.max_rounds || 
            this.team1_rounds == Math.floor(this.max_rounds / 2) + 1 || 
            this.team2_rounds == Math.floor(this.max_rounds / 2) + 1
            ){
            //match ended
            console.log(`Team1 rounds: ${this.team1_rounds}`);
            console.log(`Team2 rounds: ${this.team2_rounds}`);
            
        } else {
            this.players_team1.forEach(player => player.restore());
            this.players_team2.forEach(player => player.restore());
            this.simulate();
        }
        
    }

    player_action(player, enemies) { 
        let deals_damage = this.getRandomInt(2) == 0 ? true : false;
        if(deals_damage) {
            let not_dead_enemies = enemies.filter(enemy => enemy.is_dead != true);
            if(not_dead_enemies.length > 0){
                let enemy = not_dead_enemies[this.getRandomInt(not_dead_enemies.length)];
                let damage = this.getRandomInt(100) + 1;
                enemy.deal_damage(damage);
                if(enemy.is_dead) player.add_kill()
            }
            
        }
    }

    toString() {
        return `Max Rounds: ${this.max_rounds}`;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

}
