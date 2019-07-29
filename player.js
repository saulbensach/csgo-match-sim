module.exports = class Player {

    constructor(name) {
        this.hp = 100;
        this.name = name;
        this.kills = 0;
        this.deaths = 0;
        this.is_dead = false;
    }

    add_kill(){
        this.kills = this.kills + 1;
    }

    add_death(){
        this.deaths = this.deaths + 1;
    }

    restore() {
        this.hp = 100;
        this.is_dead = false;
    }

    deal_damage(damage) {
        this.hp = this.hp - damage;
        if(this.hp <= 0) {
            this.is_dead = true;
            this.add_death();
        }
    }

}