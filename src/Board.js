import React from "react";
import Dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";
import BoardCardList from "./BoardCardList";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = BoardCardList;

    this.state = {
      clients: {
        backlog: clients.filter(
          (client) => !client.status || client.status === "backlog"
        ),
        inProgress: clients.filter(
          (client) => client.status && client.status === "in-progress"
        ),
        complete: clients.filter(
          (client) => client.status && client.status === "complete"
        ),
      },
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];

    const drake = Dragula(containers);

    drake.on(
      "drop",
      function (el, target, source) {
        const columnMovedFrom = Object.keys(this.swimlanes).find((key) =>
          this.swimlanes[key].current.contains(source)
        );
        const columnMovingTo = Object.keys(this.swimlanes).find((key) =>
          this.swimlanes[key].current.contains(target)
        );

        const cardMovedId = el.dataset.id;
        const cardMoved = this.state.clients[columnMovedFrom].find(
          (card) => card.id === cardMovedId
        );

        const cardMovedIndex = this.state.clients[columnMovedFrom].findIndex(
          (card) => card.id === cardMovedId
        );

        if (columnMovingTo !== columnMovedFrom) {
          const columnMovingToCards = this.state.clients[columnMovingTo];
          const columnMovingFromCards = this.state.clients[columnMovedFrom];

          const newStatus =
            columnMovingTo === "inProgress" ? "in-progress" : columnMovingTo;

          const cardUpdated = { ...cardMoved, status: newStatus };

          columnMovingFromCards.splice(cardMovedIndex, 1);
          columnMovingToCards.push(cardUpdated);

          const updatedClient = {
            ...this.state.clients,
            [columnMovedFrom]: columnMovingFromCards,
            [columnMovingTo]: columnMovingToCards,
          };

          console.log(updatedClient);

          this.setState({
            clients: updatedClient,
          });
        }
      }.bind(this)
    );
  }

  renderSwimlane(name, clients, ref) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                "Backlog",
                this.state.clients.backlog,
                this.swimlanes.backlog
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "In Progress",
                this.state.clients.inProgress,
                this.swimlanes.inProgress
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "Complete",
                this.state.clients.complete,
                this.swimlanes.complete
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
