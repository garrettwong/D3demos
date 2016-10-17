class BinaryTreeNode {
    constructor(root) {
        this.head = root;
        
        var temp = this.head;
        while(temp.getNext() !== null) {
            temp = temp.getNext();
        }
        
        this.tail = temp;
    }
    
    add(node) {
        this.tail.setNext(node);
        this.tail = this.tail.getNext();
    }
    
    remove(index) {
        if (index === 0) {
            this.head = this.head.getNext();
            return;
        }
        
        var i = 1,
            temp = this.head.getNext(),
            prev = this.head;
            
        while ( i < index) {
            temp = temp.getNext();
            prev = prev.getNext();
            i++;
        }
        temp = temp.getNext();
        
        prev.setNext(temp.getNext());
    }
}