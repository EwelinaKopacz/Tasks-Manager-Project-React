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
        const{name,id} = data;
        const newTask = {
            name:name,
            id:id,
        }
        this.setState({
            tasks:[...this.state.tasks,newTask]
        })
    }

    renderTasks(){
        const {tasks} = this.state;
        return tasks.map(item => {
            return(
                <>
                <header>{item.name.toUpperCase()} 00:00:00</header>
                <footer>
                    <button>START/STOP</button>
                    <button>FINISH</button>
                    <button>REMOVE</button>
                </footer>
                </>
            )
        })
    }

    render() {
        return (
            <section>
                <h1 onClick={ this.onClick }>Tasks Manager</h1>
                <section>
                    <div>
                        {this.renderTasks()}
                    </div>
                </section>
                <h2>Add New Task:</h2>
                    <form onSubmit={this.submitHandler}>
                        <input name="task" onChange={this.changeHandler} value={this.state.task} />
                        <input type="submit" value="ADD"/>
                    </form>
            </section>
        )
    }
}

export default TasksManager;