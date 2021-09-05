class AddFilm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            scene: 0,
            title: "",
            alt_tt_1: "",
            alt_tt_2: "",
            poster_pic: "",
            year: "",
            country: [],
            language: [],
            genre: [],
            synopsis: "",
            tags: [],
            trailer: "",
            minutes: "",
            productions: "",
            imdb_score: "",
            rotten_score: "",
        };
    }

    render() {
        if (this.state.scene == 0){
            return this.renderSearch();
        }
        else if (this.state.scene == 1){
            return this.renderTitles();
        }
        else if (this.state.scene == 2){
            return this.renderPosters();
        }
        else if (this.state.scene == 3){
            return this.renderMeta();
        }
        else if (this.state.scene == 4){
            return this.renderSynopsis();
        }
        else if (this.state.scene == 5){
            return this.renderSubmitOr();
        }
        else if (this.state.scene == 6){
            return this.renderExtra();
        }
        else if (this.state.scene == 7){
            return this.renderSubmit();
        }
        else {
            return this.renderThanks();
        };
    }

    renderSearch() {
        return (
            <div className="fc ac">
                <div className="buttons">
                        <button onClick={this.prevs}> 
                            <span role="img" aria-label="film_camera"> 🎥 </span>
                        Previous </button>
                        <button onClick={this.t_BTN}> 
                            <span role="img" aria-label="film_camera"> 🎥 </span>
                        Next </button>
                </div>

            </div>
        );
    }

    prevs = () => {
        this.setState(state => ({
            num: state.num - 1
            }))
    }

    next = () => {
        this.setState(state =>({
            num: state.num + 1
                }))
        }

}

ReactDOM.render(<AddFilm />, document.querySelector("#add_film"));