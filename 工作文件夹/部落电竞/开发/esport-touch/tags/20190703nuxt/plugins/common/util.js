
export function siblings(el){
  let len = 0;
  let children = el.parentNode.childNodes;
  let result = new Array()
  for(let i = 0, len = children.length; i < len; i++){
    if(children[i].nodeType === 1 && children[i] !== el){
      result.push(children[i])
    }
  }
  return result;
}

export function hasClass(el, className){
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
export function addClass(el, className){
  if(hasClass(el, className)){
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass(el, className){
  if(!hasClass(el, className)){
    return
  }
  let reg = new RegExp('(^|\\s)'+className+'(\\s|$)', 'g')
  el.className = el.className.replace(reg, ' ')
}

export function getData(el, name, val){
  let prefix = 'data-'
  if(val){
    return el.setAttribute(prefix + name, val)
  }
  return el.getAttribute(prefix + name)
}

export function getRect(el){
  if(el instanceof window.SVGElement){
    let rect = el.getBoundingClientRect()
    return{
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  }else{
    return{
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

export function add (array) {
  let sum = 0
  for(let item of array){
    sum += item-0
  }
  return sum
}

export function parseNullAndUndefine(str){
  if(!str || str=="undefined" || str=="null"){
  return "33444";
  }
  return str;
}




















