import React from 'react';

class TasksManager extends React.Component {
    state = {
        tasks: [
            {
            name: "salads",
            time: 0,
            isRunning: "false",
            isDone: "false",
            isRemove: "false",
            id: 1
            }
        ],
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
            body: JSON.stringify({ name:task,time:0,isRunning:"false",isDone:"false",isRemove:"false" })
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
        return tasks.map(item => {
            return(
                <div>
                    <header >{item.name.toUpperCase()}</header>
                    <div>Czas wykonania: {item.time} s.</div>
                    <footer>
                        <button onClick={this.timeHandler(item)}>{!item.isRunning ? 'START' : 'STOP'}</button>
                        <button>FINISH</button>
                        <button disabled="true">REMOVE</button>
                    </footer>
                </div>
            )
        });
    }

    timeHandler = item =>{
        console.log(item.id);
        this.idTimer = setInterval(() => {
            this.incrementTime(item.id);
          },1000);
    }

    incrementTime(id) {
        this.setState(state => {
            const newTasks = state.tasks.map(task => {
                if(task.id === id) {
                    return {...task, time: task.time + 1}
                }
                return task;
            });
            return {
                tasks: newTasks,
            }
        });
    }

    // stopTimer = item => {
    //     clearInterval(this.idTimer);
    // }


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