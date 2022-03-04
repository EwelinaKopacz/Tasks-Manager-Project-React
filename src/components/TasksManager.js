import React from 'react';

class TasksManager extends React.Component {
    state = {
        tasks: [],
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
                <div>
                    <header >{item.name.toUpperCase()}</header>
                    <div>Czas wykonania: {item.time} s.</div>
                    <footer>
                        {/* <button onClick={() => this.clickStartStop(item)}>{item.isRunning ? 'STOP' : 'START'}</button> */}
                        <button onClick={() => this.startHandler(item.id)}>START</button>
                        <button onClick={() => this.stopHandler(item.id)}>STOP</button>
                        <button onClick={() => this.finishHandler(item.id)}>{item.isDone ? 'COMPLETED' : 'FINISH'}</button>
                        <button onClick={() => this.deleteHandler(item.id)} disabled={this.disabledStatusDelete(item)}>REMOVE</button>
                    </footer>
                </div>
            )
        });
    }
    // NIE CHCE DZIAŁAĆ: WYSWIETLA SIE START, 1 KLIK - WYSWIETLA SIE STOP - 2 KLIK DOPIERO ZLICZA I NIE ZATRZYMUJE SIE NA STOP
    // clickStartStop = item => {
    //     const {isRunning} = item;
    //     item.isRunning ? this.timeHandlerStart(item.id) : this.timeHandlerStop(item.id);
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
                    return {...task, time: task.time + 1, isRunning: true}
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
                    return {...task,isRunning:!task.isRunning}
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
                    return {...task,isDone:!task.isDone,isRunning:false}
                }
                return task;
            })
        }))
    }

    deleteHandler = id => {
        this.setState((prevState) => ({
            tasks: prevState.tasks.map(task => {
                if(task.id === id) {
                    return {...task,isRemove:!task.isRemove}
                }
                return task;
            })
        }))
    }

    disabledStatusDelete = item => {
        return item.isDone ? false : true;
    }

    render() {
        return (
            <section>
                <h1 onClick={ this.onClick }>Tasks Manager</h1>
                <section>
                    {this.renderTasks()}
                </section>
                <h2>Add New Task:</h2>
                    <form onSubmit={this.submitHandler}>
                        <input name="task" onChange={this.changeHandler} value={this.state.task} placeholder='Write new task' />
                        <input type="submit" value="ADD"/>
                    </form>
            </section>
        )
    }
}

export default TasksManager;