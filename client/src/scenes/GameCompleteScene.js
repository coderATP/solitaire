import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import domUI from "../ui/domUIManager.js";

export class GameCompleteScene extends BaseScene {
    
    constructor(config) {
        super("GameCompleteScene", config);
        this.config = config;
        this.gamePaused = true;
    }
    
    injectUI() {
        this.dom = domUI.show(`
            <section id="solitaire-complete-screen">
                <div id="solitaire-complete-panel">

                    <div id="solitaire-complete-header">
                        <div id="solitaire-complete-title">
                            GAME COMPLETE
                        </div>

                        <div id="solitaire-complete-subtitle">
                            Congratulations!
                        </div>
                    </div>

                    <div id="solitaire-complete-stats">

                        <div class="solitaire-complete-stat">
                            <span>Score</span>
                            <strong id="solitaire-complete-score">
                                0
                            </strong>
                        </div>

                        <div class="solitaire-complete-stat">
                            <span>Moves</span>
                            <strong id="solitaire-complete-moves">
                                0
                            </strong>
                        </div>

                        <div class="solitaire-complete-stat">
                            <span>Time</span>
                            <strong id="solitaire-complete-time">
                                00:00
                            </strong>
                        </div>

                    </div>

                    <div id="solitaire-complete-buttons">

                        <button id="solitaire-complete-new-game-btn">
                            NEW GAME
                        </button>

                        <button id="solitaire-complete-replay-btn">
                            RESTART
                        </button>

                        <button id="solitaire-complete-menu-btn">
                            MENU
                        </button>

                    </div>

                </div>
            </section>
        `);
        
        this.scoreText =
            this.dom.querySelector(
                "#solitaire-complete-score"
            );
        
        this.movesText =
            this.dom.querySelector(
                "#solitaire-complete-moves"
            );
        
        this.timeText =
            this.dom.querySelector(
                "#solitaire-complete-time"
            );
        
        this.newGameBtn =
            this.dom.querySelector(
                "#solitaire-complete-new-game-btn"
            );
        
        this.replayBtn =
            this.dom.querySelector(
                "#solitaire-complete-replay-btn"
            );
        
        this.menuBtn =
            this.dom.querySelector(
                "#solitaire-complete-menu-btn"
            );
    }
    
    displayStatistics() {
        const { PlayScene } = this.game.scene.keys;
        
        const score =
            PlayScene.commandHandler.getMovementsScore();
        
        const moves =
            PlayScene.commandHandler.getTotalMoves();
        
        const time =
            PlayScene.watch.getTime();
        
        this.scoreText.textContent = score;
        this.movesText.textContent = moves;
        this.timeText.textContent = time;
    }
    
    create() {
        domUI.clear();
        this.injectUI();
        this.displayStatistics();
        this.handleGameComplete();
        this.processEvents();
    }
    
    processEvents() {
        const { PlayScene } = this.game.scene.keys;
        
        eventEmitter.once(
            "GameCompleteToMenu",
            () => {
                if (!this.gamePaused) return;
                
                PlayScene.audio.popUpSound.play();
                PlayScene.watch.resetWatch();
                
                domUI.clear();
                
                this.scene.stop();
                this.scene.stop("PlayScene");
                this.scene.start("MenuScene");
                
                this.gamePaused = false;
            }
        );
        
        eventEmitter.once(
            "GameCompleteToNewGame",
            () => {
                if (!this.gamePaused) return;
                
                PlayScene.watch.resetWatch();
                
                PlayScene.audio.popUpSound.play();
                
                domUI.clear();
                
                this.scene.stop();
                this.scene.stop("PlayScene");
                this.scene.start("PlayScene");
                
                this.gamePaused = false;
            }
        );
        
        eventEmitter.once(
            "GameCompleteToRestart",
            () => {
                if (!this.gamePaused) return;
                
                PlayScene.watch
                    .resetWatch()
                    .setUpWatch();
                
                PlayScene.audio.popUpSound.play();
                
                PlayScene.solitaire.onClickRestartButton();
                
                PlayScene.commandHandler.reset();
                
                PlayScene.updateMoves();
                PlayScene.updateScore();
                
                domUI.clear();
                
                this.scene.stop();
                
                if (this.scene.isPaused("PlayScene")) {
                    this.scene.resume("PlayScene");
                }
                
                this.gamePaused = false;
            }
        );
    }
    
    handleGameComplete() {
        const { PlayScene } = this.game.scene.keys;
        
        PlayScene.watch.stopWatch();
        
        this.newGameBtn.addEventListener(
            "click",
            () => {
                eventEmitter.emit(
                    "GameCompleteToNewGame"
                );
            }
        );
        
        this.menuBtn.addEventListener(
            "click",
            () => {
                eventEmitter.emit(
                    "GameCompleteToMenu"
                );
            }
        );
        
        this.replayBtn.addEventListener(
            "click",
            () => {
                eventEmitter.emit(
                    "GameCompleteToRestart"
                );
            }
        );
    }
    
    shutdown() {
        domUI.clear();
    }
}