import React from 'react';

class TasksManager extends React.Component {
    constructor(props){
        super(props);
        this.api = `http://localhost:3005/data`;
        this.idTimer = null;
    }
    state = {
        tasks: [],
    }

    async componentDidMount(){
        try{
            const response = await fetch(`${this.api}`);
            const tasks = await response.json();
            this.setState({tasks})
        }
        catch(error){
            console.error(error.message);
        }
    }

    onClick = () => {
        const { tasks } = this.state;
        console.log( tasks)
    }

    changeHandler = e => {
        const {name,value} = e.target;
        this.setState({
            [name]:value
        });
    }

    submitHandler = e => {
        e.preventDefault();

        const{task} = this.state;
        if(task){
        const requestOptions = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name:task,time:0,isRunning:false,isDone:false,isRemove:false })
        }
        fetch(this.api,requestOptions)
            .then(response => {return response.json()})
            .then(data => this.addTaskToState(data))
            .catch(error => console.error(error))
            .finally(() => {
                this.setState({task:''})
            });
        }
        else{
            alert('If you want to add new task, please write a task')
        }
    }

    addTaskToState(data){
        this.setState({
            tasks:[...this.state.tasks,data]
        })
    }

    renderTasks(){
        const {tasks} = this.state;
        const filterList = tasks.filter(task => task.isRemove === false);
        const sorterList = filterList.sort((a,b) => a.isDone - b.isDone);

        return  sorterList.map(item => {
            return(
                <div className='task__box'>
                    <div className='task__data'>
                        <header className='task__name' >{item.name.toUpperCase()}</header>
                        <span>Czas wykonania: {item.time} s.</span>
                    </div>
                    <footer className='task__options'>
                        <button className='tasks__buttons button__startstop' onClick={() => this.startStopHandler(item)}>{item.isRunning ? 'STOP' : 'START'}</button>
                        <button className='tasks__buttons' onClick={() => this.finishHandler(item.id)} className={item.isDone ? 'button__finish' : 'tasks__buttons'}>{item.isDone ? 'COMPLETED' : 'FINISH'}</button>
                        <button className='tasks__buttons button__remove' onClick={() => this.deleteHandler(item.id)} disabled={this.disabledStatusDelete(item)}>REMOVE</button>
                    </footer>
                </div>
            )
        });
    }

    startStopHandler = item => {
        const {isRunning} = item;
        isRunning ? this.stopHandler(item.id) : this.startHandler(item.id);
    }

    startHandler = id => {
        if(!this.idTimer){
            this.idTimer = setInterval(() => {
                this.incrementTime(id);
            },1000);
        }
        else{
            alert('Only one task at the same time.')
        }

    }

    incrementTime (id) {
        this.setState(state => {
            const newTasks = state.tasks.map(task => {
                if(task.id === id) {
                    const data = {...task, time: task.time + 1, isRunning: true};
                    this.updateData(data);
                    return data;
                }
                return task;
            });
            return {
                tasks: newTasks,
            }
        });
    }

    stopHandler = id => {
        clearInterval(this.idTimer);
        this.idTimer = null;

        this.setState((prevState) => ({
            tasks: prevState.tasks.map(task => {
                if(task.id === id){
                    const data = {...task,isRunning:!task.isRunning};
                    this.updateData(data);
                    return data;
                }
                return task;
            })
        }))
    }

    finishHandler = id => {
        clearInterval(this.idTimer);
        this.idTimer = null;
        this.setState((prevState) => ({
            tasks: prevState.tasks.map(task => {
                if((task.id === id) || ((task.isRunning))){
                    const data = {...task,isDone:!task.isDone,isRunning:false};
                    this.updateData(data);
                    return data;
                }
                return task;
            })
        }))
    }

    deleteHandler = id => {
        this.setState((prevState) => ({
            tasks: prevState.tasks.map(task => {
                if((task.id === id) && (this.confirmRemoveTask())) {
                    const data = {...task,isRemove:!task.isRemove};
                    this.updateData(data);
                    return data
                }
                return task;
            })
        }))
    }

    confirmRemoveTask = () => {
        if(confirm('Are you sure you want to remove this task?')){
            return true;
        }
        return false
    }

    disabledStatusDelete = item => {
        return item.isDone ? false : true;
    }

    updateData = data => {
        const{id} = data;
        const requestOptions = {
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }
        fetch(`${this.api}/${id}`,requestOptions)
            .then(response => {return response.json()})
            .catch(error => console.error(error))
    }

    render() {
        return (
            <section className='tasks__container'>
                <section>
                    <h1 className='tasks__header' onClick={ this.onClick }>Tasks Manager</h1>
                        {this.renderTasks()}
                </section>
                <section>
                    <h2>Add New Task:</h2>
                        <form className='task__form'onSubmit={this.submitHandler}>
                            <input className='task__input' name="task" onChange={this.changeHandler} value={this.state.task} placeholder='Write new task' />
                            <input className='task__button' type="submit" value="ADD"/>
                        </form>
                </section>
            </section>
        )
    }

    componentWillUnmount(){
        clearInterval(this.idTimer);
    }
}

export default TasksManager;