import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import domUI from "../ui/domUIManager.js";

export class PlaybookScene extends BaseScene{

    constructor(config){
        super("PlaybookScene",config);

        this.config = config;
        this.currentSlide = 0;
        this.handleKeyDown = null;
    }

    injectUI(){
        this.dom = domUI.show(`
            <section id="solitaire-playbook-screen">

                <div id="solitaire-playbook-panel">

                    <header id="solitaire-playbook-header">

                        <h2>
                            SOLITAIRE PLAYBOOK
                        </h2>

                        <span>
                            Klondike Quick Reference
                        </span>

                    </header>

                    <div id="solitaire-playbook-slider-wrapper">

                        <button
                            id="solitaire-playbook-prev"
                            class="solitaire-playbook-slide-btn"
                        >
                            ⟵
                        </button>

                        <div id="solitaire-playbook-slider">

                            <section class="solitaire-playbook-section">

                                <h3>
                                    OBJECTIVE
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Complete All Four Foundations
                                    </h4>

                                    <p>
                                        The goal is to move every card from
                                        the tableau and draw/discard piles into
                                        the four foundation piles.
                                    </p>

                                    <p>
                                        Each foundation is built upward from
                                        Ace to King using cards of the same suit.
                                    </p>

                                    <div class="solitaire-playbook-rule">
                                        <strong>Foundation order:</strong>
                                        A → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → J → Q → K
                                    </div>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    THE BOARD
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Tableau
                                    </h4>

                                    <p>
                                        The tableau contains seven piles.
                                        Cards are arranged from left to right,
                                        with only the top card of each pile
                                        available for normal play.
                                    </p>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Draw & Discard
                                    </h4>

                                    <p>
                                        The draw pile contains cards that have
                                        not yet entered play. Drawing a card
                                        moves it to the discard pile.
                                    </p>

                                    <p>
                                        When the draw pile becomes empty,
                                        the discard pile can be recycled back
                                        into the draw pile.
                                    </p>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Foundations
                                    </h4>

                                    <p>
                                        There are four foundation piles,
                                        one for each suit. Each foundation
                                        starts with an Ace and continues upward
                                        to King.
                                    </p>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    TABLEAU MOVES
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Build Downward
                                    </h4>

                                    <p>
                                        Tableau sequences are built in
                                        descending numerical order.
                                    </p>

                                    <div class="solitaire-playbook-example">
                                        K → Q → J → 10 → 9
                                    </div>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Alternate Colours
                                    </h4>

                                    <p>
                                        A card can be placed on another tableau
                                        card only when it is one rank lower
                                        and has the opposite colour.
                                    </p>

                                    <div class="solitaire-playbook-example">
                                        9♠️ → 8♥️ → 7♣️ → 6♦️
                                    </div>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Move Sequences
                                    </h4>

                                    <p>
                                        A valid face-up sequence can be moved
                                        together from one tableau pile to another
                                        when the entire sequence can legally
                                        be placed on the destination card.
                                    </p>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Empty Tableau Piles
                                    </h4>

                                    <p>
                                        An empty tableau pile can only be filled
                                        with a King or a sequence beginning with
                                        a King.
                                    </p>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    FOUNDATIONS
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Building a Foundation
                                    </h4>

                                    <p>
                                        Foundations are built upward in the same
                                        suit, starting with Ace.
                                    </p>

                                    <div class="solitaire-playbook-example">
                                        A♥️ → 2❤️ → 3❤️... → K❤️
                                    </div>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Foundation Rules
                                    </h4>

                                    <ul>
                                        <li>
                                            An Ace starts an empty foundation.
                                        </li>

                                        <li>
                                            The next card must be one rank higher.
                                        </li>

                                        <li>
                                            Cards must belong to the same suit.
                                        </li>

                                        <li>
                                            A card cannot skip a rank.
                                        </li>
                                    </ul>

                                </div>

                                <div class="solitaire-playbook-rule">
                                    <strong>Remember:</strong>
                                    Tableau builds down with alternating colours.
                                    Foundations build up by matching suit.
                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    DRAW & DISCARD
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Drawing a Card
                                    </h4>

                                    <p>
                                        Tap the draw pile to move its top card
                                        into the discard pile.
                                    </p>

                                    <p>
                                        The top card of the discard pile is
                                        available for play.
                                    </p>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Recycling the Discard
                                    </h4>

                                    <p>
                                        Once the draw pile is empty, tap the
                                        empty draw area to recycle the discard
                                        pile back into the draw pile.
                                    </p>

                                    <div class="solitaire-playbook-rule">
                                        Draw pile empty → recycle discard → draw again
                                    </div>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Think Before Drawing
                                    </h4>

                                    <p>
                                        A card revealed from the draw pile may
                                        be useful on the tableau or foundation.
                                        Consider available moves before drawing
                                        another card.
                                    </p>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    HIDDEN CARDS
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Reveal Face-Down Cards
                                    </h4>

                                    <p>
                                        Moving the face-up cards away from the
                                        top of a tableau pile can reveal a hidden
                                        card underneath.
                                    </p>

                                    <p>
                                        Revealing hidden cards is one of the most
                                        important goals during the early stages
                                        of a game.
                                    </p>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Prioritize Uncovering Cards
                                    </h4>

                                    <p>
                                        When you have several legal moves,
                                        consider the move that reveals a hidden
                                        card or creates a useful empty tableau
                                        space.
                                    </p>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    UNDO
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Undo Your Last Move
                                    </h4>

                                    <p>
                                        The Undo button reverses the most recent
                                        valid movement.
                                    </p>

                                    <p>
                                        This can restore cards to their previous
                                        pile and restore their previous state.
                                    </p>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Use Undo Strategically
                                    </h4>

                                    <p>
                                        If a move creates a worse position,
                                        undo it and try another sequence.
                                    </p>

                                    <p>
                                        Undo can be especially useful when
                                        experimenting with tableau moves,
                                        foundations, and the draw pile.
                                    </p>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    GAME STATUS
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Moves
                                    </h4>

                                    <p>
                                        The Moves counter tracks the number of
                                        movements made during the game,
                                        including undo operations.
                                    </p>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Score
                                    </h4>

                                    <p>
                                        Your score changes according to the
                                        movement performed during the game.
                                    </p>

                                    <div class="solitaire-playbook-score-list">
                                        <span>Tableau → Foundation</span>
                                        <strong>+100</strong>

                                        <span>Discard → Foundation</span>
                                        <strong>+100</strong>
                                    </div>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Timer
                                    </h4>

                                    <p>
                                        The timer records how long you have
                                        been playing. It pauses when the game
                                        is paused and resumes when gameplay
                                        continues.
                                    </p>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    WINNING
                                </h3>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        Complete Every Foundation
                                    </h4>

                                    <p>
                                        The game is completed when all cards
                                        have been successfully moved into the
                                        four foundation piles.
                                    </p>

                                    <div class="solitaire-playbook-win">
                                        K—K—K—K<br>
                                        ❤️ ♣️ ♦️ ♠️
                                    </div>

                                </div>

                                <div class="solitaire-playbook-card">

                                    <h4>
                                        What To Aim For
                                    </h4>

                                    <ul>
                                        <li>
                                            Reveal hidden tableau cards.
                                        </li>

                                        <li>
                                            Create useful tableau sequences.
                                        </li>

                                        <li>
                                            Free tableau spaces when possible.
                                        </li>

                                        <li>
                                            Move cards to foundations when safe.
                                        </li>

                                        <li>
                                            Manage the draw and discard piles carefully.
                                        </li>
                                    </ul>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    QUICK TIPS
                                </h3>

                                <div class="solitaire-playbook-tips">

                                    <div>
                                        <strong>01</strong>
                                        <span>
                                            Reveal hidden cards whenever a good
                                            opportunity appears.
                                        </span>
                                    </div>

                                    <div>
                                        <strong>02</strong>
                                        <span>
                                            Do not automatically move every
                                            available card to a foundation.
                                        </span>
                                    </div>

                                    <div>
                                        <strong>03</strong>
                                        <span>
                                            Keep useful low cards available for
                                            building tableau sequences.
                                        </span>
                                    </div>

                                    <div>
                                        <strong>04</strong>
                                        <span>
                                            Creating an empty tableau pile can
                                            give you more flexibility.
                                        </span>
                                    </div>

                                    <div>
                                        <strong>05</strong>
                                        <span>
                                            Look through your available moves
                                            before drawing another card.
                                        </span>
                                    </div>

                                    <div>
                                        <strong>06</strong>
                                        <span>
                                            Use Undo when a move produces a
                                            worse position.
                                        </span>
                                    </div>

                                    <div>
                                        <strong>07</strong>
                                        <span>
                                            Plan several moves ahead instead of
                                            taking the first legal move.
                                        </span>
                                    </div>

                                </div>

                            </section>

                            <section class="solitaire-playbook-section">

                                <h3>
                                    QUICK REFERENCE
                                </h3>

                                <div class="solitaire-playbook-reference">

                                    <div>
                                        <span>TABLEAU</span>
                                        <strong>
                                            Downward + alternating colours
                                        </strong>
                                    </div>

                                    <div>
                                        <span>FOUNDATION</span>
                                        <strong>
                                            Upward + same suit
                                        </strong>
                                    </div>

                                    <div>
                                        <span>EMPTY TABLEAU</span>
                                        <strong>
                                            King only
                                        </strong>
                                    </div>

                                    <div>
                                        <span>DRAW</span>
                                        <strong>
                                            Draw pile → discard
                                        </strong>
                                    </div>

                                    <div>
                                        <span>RECYCLE</span>
                                        <strong>
                                            Empty draw → discard back to draw
                                        </strong>
                                    </div>

                                    <div>
                                        <span>UNDO</span>
                                        <strong>
                                            Reverse the last valid movement
                                        </strong>
                                    </div>

                                    <div>
                                        <span>WIN</span>
                                        <strong>
                                            All four foundations completed
                                        </strong>
                                    </div>

                                </div>

                            </section>

                        </div>

                        <button
                            id="solitaire-playbook-next"
                            class="solitaire-playbook-slide-btn"
                        >
                            ⟶
                        </button>

                    </div>

                    <footer id="solitaire-playbook-footer">

                        <span>
                            Solitaire • Klondike
                        </span>

                        <button id="solitaire-playbook-back">
                            BACK
                        </button>

                    </footer>

                </div>

            </section>
        `);
    }

    setupSlider(){
        const slider =
            this.dom.querySelector(
                "#solitaire-playbook-slider"
            );

        const slides =
            this.dom.querySelectorAll(
                ".solitaire-playbook-section"
            );

        const nextBtn =
            this.dom.querySelector(
                "#solitaire-playbook-next"
            );

        const prevBtn =
            this.dom.querySelector(
                "#solitaire-playbook-prev"
            );

        this.currentSlide = 0;

        const totalSlides = slides.length;

        const updateSlide = () => {
            slider.style.transform =
                `translateX(-${this.currentSlide * 100}%)`;
        };

        nextBtn.addEventListener("click",()=>{
            this.currentSlide =
                (this.currentSlide + 1) %
                totalSlides;

            updateSlide();
        });

        prevBtn.addEventListener("click",()=>{
            this.currentSlide =
                (this.currentSlide - 1 + totalSlides) %
                totalSlides;

            updateSlide();
        });

        let startX = 0;
        let endX = 0;

        slider.addEventListener("touchstart",(event)=>{
            startX = event.touches[0].clientX;
            endX = startX;
        });

        slider.addEventListener("touchmove",(event)=>{
            endX = event.touches[0].clientX;
        });

        slider.addEventListener("touchend",()=>{
            const diff = startX - endX;

            if(Math.abs(diff) <= 50){
                return;
            }

            if(diff > 0){
                this.currentSlide =
                    (this.currentSlide + 1) %
                    totalSlides;
            }else{
                this.currentSlide =
                    (this.currentSlide - 1 + totalSlides) %
                    totalSlides;
            }

            updateSlide();
        });

        this.handleKeyDown = (event)=>{
            if(event.key === "ArrowRight"){
                this.currentSlide =
                    (this.currentSlide + 1) %
                    totalSlides;

                updateSlide();
            }

            if(event.key === "ArrowLeft"){
                this.currentSlide =
                    (this.currentSlide - 1 + totalSlides) %
                    totalSlides;

                updateSlide();
            }
        };

        document.addEventListener(
            "keydown",
            this.handleKeyDown
        );
    }

    processEvents(){
        const backBtn =
            this.dom.querySelector(
                "#solitaire-playbook-back"
            );

        backBtn.addEventListener("click",()=>{
            eventEmitter.emit("PlaybookToPause");
        });

        eventEmitter.off("PlaybookToPause");

        eventEmitter.once(
            "PlaybookToPause",
            ()=>{
                this.scene.stop();
                this.scene.launch("PauseScene");
            }
        );
    }

    create(){
        domUI.clear();

        this.injectUI();
        this.setupSlider();
        this.processEvents();
    }

    shutdown(){
        if(this.handleKeyDown){
            document.removeEventListener(
                "keydown",
                this.handleKeyDown
            );

            this.handleKeyDown = null;
        }

        domUI.clear();
    }
}