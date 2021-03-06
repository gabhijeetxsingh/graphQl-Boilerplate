import React, {Component} from 'react';
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css';
import EventList from "../components/Events/EventsList/EventList";
import Spinner from '../components/Spinner/Spinner';

class EventsPage extends Component {

    state= {
        creating : false,
        events : [],
        isLoading : false,
        selectedEvent : null
    }

    constructor (props) {
        super(props);
        this.titleElRef = React.createRef();        
        this.priceElRef = React.createRef();        
        this.dateElRef = React.createRef();        
        this.descriptionElRef = React.createRef();        
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({creating : true});
    }

    modalConfirmHandler = () => {
        this.setState({creating : false});
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if(title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }
    
        let requstBody = {
                query : `
                    mutation CreateEvent($title : String!, $desc: String!, $price: Float!, $date : String!){
                        createEvent(eventInput : {title : $title, description: $desc, price: $price, date : $date}) {
                            _id
                            title
                            description
                            date
                            price
                        }
                    }
                `,
                variables : {
                    title : title,
                    desc : description,
                    price :price,
                    date : date
                }
            };

        fetch("http://localhost:4000/graphql", {
            method : "POST",
            body : JSON.stringify(requstBody),
            headers : {
                'Content-Type' : 'application/json',
            }
        })
        .then((res) => {
            if(res.status !==200 && res.status !==201) {
                throw new Error("Failed", res);
            }
            return res.json();
        })
        .then(resData=> {
            this.setState(prevState=> {
                const updatedEvents = [...prevState.events];
                let eventDetail = resData.data.createEvent;

                updatedEvents.push({
                    _id : eventDetail._id,
                    title : eventDetail.title,
                    description : eventDetail.description,
                    date : eventDetail.date,
                    price : eventDetail.price,
                })

                return {events : updatedEvents}
            })
        })
        .catch(err=> {
            console.log(err);
        })


    }

    modalCancelHandler = () => {
        this.setState({creating : false, selectedEvent : null});
    }

    fetchEvents() {
        this.setState({isLoading : true})

        let requstBody = {
            query : `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `
        };

        fetch("http://localhost:4000/graphql", {
            method : "POST",
            body : JSON.stringify(requstBody),
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then((res) => {
            if(res.status !==200 && res.status !==201) {
                throw new Error("Failed", res);
            }
            return res.json();
        })
        .then(resData=> {
            const {events} = resData.data;
            this.setState({events : events, isLoading : false});
        })
        .catch(err=> {
            console.log(err);
            this.setState({isLoading : false});

        })


    }

    showDetailHandler = eventId => {
        this.setState(prevState=> {
            const selectedEvent = prevState.events.find(e=>e._id === eventId);
            return {selectedEvent : selectedEvent}
        })
    }

    bookEventHandler= () => {

        if(!this.context.token) {
            this.setState({selectedEvent : null});
            return
        }
        let requstBody = {
            query : `
                mutation BookEvent($id : ID!){
                    bookEvent(eventId : $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables : {
                id : this.state.selectedEvent._id
            }
        };

        fetch("http://localhost:4000/graphql", {
            method : "POST",
            body : JSON.stringify(requstBody),
            headers : {
                'Content-Type' : 'application/json',
                "Authorization" : "Bearer " +  this.context.token 
            }
        })
        .then((res) => {
            if(res.status !==200 && res.status !==201) {
                throw new Error("Failed", res);
            }
            return res.json();
        })
        .then(resData=> {
            this.setState({selectedEvent : null});
        })
        .catch(err=> {
            console.log(err);
            this.setState({isLoading : false});

        })

    }

    render() {

        return (
        <React.Fragment>
            {(this.state.creating || this.state.selectedEvent) && <Backdrop/>}
            
            {this.state.creating && (
            <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler} confirmText="Confirm">
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" ref={this.titleElRef}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" ref={this.priceElRef}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" ref={this.dateElRef}></input>
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
                    </div>
                </form>
            </Modal>
            )}

            {this.state.selectedEvent && (
                <Modal title={this.state.selectedEvent.title} canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.bookEventHandler} confirmText={this.context.token ? 'Book' : 'Confirm'}>
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>
                            {this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}
                        </h2>
                        <p>{this.state.selectedEvent.description}</p>
                </Modal>
            )}

            <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
            </div>

            {this.state.isLoading ? <Spinner/> : (<EventList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.showDetailHandler}/>)}
            
        </React.Fragment>
        );
        
    }
}

export default EventsPage;