import data from './data.js';

let APP_STATE = null;


const initState = (data) => {

};


const saveIntoLocalStorage = () => {
  console.log('saving into local storage');
};


const updateActiveLiItem = (obj) => {
  const currentHighlighted = document.getElementsByClassName("list-item-highlight");
  console.log(currentHighlighted)
  if(currentHighlighted.length) {
    currentHighlighted.item(0).classList.remove("list-item-highlight");
  }
  obj.classList.add("list-item-highlight");
};


const onClickListItem = (liObj) => {
  const isCollapsed = liObj.getAttribute("collapse") === "true";
  if(isCollapsed) {
    liObj.setAttribute("collapse", "false");
  } else {
    liObj.setAttribute("collapse", "true");
  }
  updateActiveLiItem(liObj);
  saveIntoLocalStorage();
};


const getClassNameMiddleware = (liItem) => {
  let className = "list-item-metadata";
  if(liItem.name[0] === '.')
    className += " list-item-dim";
  return className;
};


const getListItemIconMiddleware = (itemName) => {
  const iconMapper = {
    json: "J",
    md: "M",
    lock: "L"
  };

  const extension = itemName.slice(
    itemName.indexOf(".") === -1 ? 0 : itemName.indexOf(".") + 1
  );
  return iconMapper[extension] || "F";
}


const createListItem = (data) => {
  const div = document.createElement("div");
  const spanText = document.createElement("div");
  const spanIcon = document.createElement("div");

  div.className = getClassNameMiddleware(data);
  spanText.className = "list-item-metadata-text";
  spanIcon.className = "list-item-metadata-icon";

  spanText.innerText = data.name;
  spanIcon.innerText = data.isDir ? ">" : getListItemIconMiddleware(data.name);

  div.appendChild(spanIcon);
  div.appendChild(spanText);
  return div;
};


const renderExplorer = (data) => {
  const ul = document.createElement("ul");
  ul.className = "list-container";

  data.forEach((liItem) => {
    const li = document.createElement("li");
    li.className = "list-item " + (liItem.isDir ? "list-item-dir" : "list-item-file");
    li.setAttribute("collapse", "true");
    li.appendChild(createListItem(liItem));

    if(liItem.isDir && liItem.children?.length) {
      li.appendChild(renderExplorer(liItem.children));
    }

    ul.appendChild(li);
  });

  return ul;
};


document.addEventListener('readystatechange', function() {
  
  const root = document.getElementById("root");
  root.appendChild(renderExplorer(data));

  [...document.querySelectorAll(".list-item-dir > .list-item-metadata")].forEach(li => {
    li.addEventListener('click', () => onClickListItem(li.parentElement));
  })

});