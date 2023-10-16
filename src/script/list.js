export class List {
  STATE = {
    LOADING: 'Loading',
    SUCCESS: 'success',
    ERROR: 'error',
  }
  status = null
  data = null
  element = null

  updateStatus = (status, data) => {
    this.status = status
    if (data) this.data = data
    this.updateView()
  }

  updateView = () => {}

  loadData = async () => {}

  convertData = () => {}
}
