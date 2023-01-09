var treeDataRef

function addNode(name, url) {
  if (!treeDataRef || !treeDataRef.children) return

  let node = {
    name: name,
    url: url,
  }

  treeDataRef.children.push(node)
}

// event
document.getElementById('addNode').addEventListener('click', function () {
  let name = document.getElementById('name').value
  let url = document.getElementById('url').value

  if (!treeDataRef || !treeDataRef.children) return

  addNode(name, url)

  // refresh
  update(treeDataRef)
})
