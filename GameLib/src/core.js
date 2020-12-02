import events from './event/eventHandler.js';
import {config} from './config/config.js';
import cec from './cecs';
import storeFactory from './store/storeFactory.js';
import cecs from './cecs';

class GameEngine {
    constructor(){

    }

    init(){

        // register built in systems?
        //cec.systemHandler.registerSystem();
    }

    setConfig(configObject){
        // update the GameEngines Store
        
    }

    run(ts = 0, time = 0){
        //const {totalTime} = storeFactory.getStore('engine').access('totalTime');
        // set dt = new time - old time
        const deltaTime =  ts - time;

        time = ts;
        // tell the store there is a new total time
        //engineStore.update('totalTime',  totalTime + deltaTime);
        console.log(Math.floor(1/(deltaTime/1000)));

        // run registered systems
        cecs.systemHandler.run();
        // run events generated by event system
        events.finalize();
        requestAnimationFrame((timeStamp) => this.run(timeStamp, time));
    }
}

function core(){

    // create a store for the engine to use
    storeFactory.createStore('engine', config);
    cecs.systemHandler.registerSystem(new cecs.built_in());
    return {
        engine: new GameEngine(),
        ecs: cec,
        store: storeFactory,
        events: events
    }
}


export default core();

