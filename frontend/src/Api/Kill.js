import axios from 'axios'

function onClose() {
  window.open("about:blank", "_self").close();
}

export default async function Kill() {
  try {
    await axios({
      method: 'get',
      url: '/kill',
      timeout: 100
    })
  } finally {
    onClose()
  }
}