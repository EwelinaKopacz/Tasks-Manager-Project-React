import React from 'react';

class TasksManager extends React.Component {
    state = {
        tasks: [],
    }

    async componentDidMount(){
        const url = 'http://localhost:3005/data';
        try{
            const response = await fetch(`${url}`);
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
        fetch('http://localhost:3005/data',requestOptions)
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
                        {/* <button onClick={() => this.clickStartStop(item)}>{item.isRunning ? 'STOP' : 'START'}</button> */}
                        <button className='tasks__buttons' onClick={() => this.startHandler(item.id)}>START</button>
                        <button className='tasks__buttons' onClick={() => this.stopHandler(item.id)}>STOP</button>
                        <button className='tasks__buttons' onClick={() => this.finishHandler(item.id)}>{item.isDone ? 'COMPLETED' : 'FINISH'}</button>
                        <button className='tasks__buttons' onClick={() => this.deleteHandler(item.id)} disabled={this.disabledStatusDelete(item)}>REMOVE</button>
                    </footer>
                </div>
            )
        });
    }
    // NIE CHCE DZIAŁAĆ: WYSWIETLA SIE START, 1 KLIK - WYSWIETLA SIE STOP - 2 KLIK DOPIERO ZLICZA I NIE ZATRZYMUJE SIE NA STOP
    // clickStartStop = item => {
    //     const {isRunning} = item;
    //     isRunning ? this.startHandler(item.id) : this.stopHandler(item.id);
    // }

    startHandler = id =>{
        console.log(id);
        this.idTimer = setInterval(() => {
            this.incrementTime(id);
          },1000);
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
                if(task.id === id) {
                    const data = {...task,isRemove:!task.isRemove};
                    this.updateData(data);
                    return data
                }
                return task;
            })
        }))
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
        fetch(`http://localhost:3005/data/${id}`,requestOptions)
            .then(response => {return response.json()})
            .then(data => console.log(data))
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