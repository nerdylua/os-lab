const experiments = [
  {
    title: "Infix_to_postfix",
        code: `#include<iostream>
    #include<string>
    #define SIZE 10
    using namespace std;

    class Stack {
        char data[SIZE];
        int top;
    public:
        Stack() : top(-1) {}
        void push(char val) { if (top < SIZE - 1) data[++top] = val; }
        char pop() { return (top == -1) ? '\0' : data[top--]; }
        char peek() { return (top == -1) ? '\0' : data[top]; }
        bool isEmpty() { return top == -1; }
    };

    int precedence(char op) {
        return (op == '^') ? 3 : (op == '*' || op == '/') ? 2 : (op == '+' || op == '-') ? 1 : 0;
    }

    string convertToPostfix(const string& exp) {
        Stack st;
        string postfix;
        for (char ch : exp) {
            if (isalnum(ch)) postfix += ch;
            else if (ch == '(') st.push(ch);
            else if (ch == ')') {
                while (!st.isEmpty() && st.peek() != '(') postfix += st.pop();
                st.pop();
            } else {
                while (!st.isEmpty() && precedence(st.peek()) >= precedence(ch)) postfix += st.pop();
                st.push(ch);
            }
        }
        while (!st.isEmpty()) postfix += st.pop();
        return postfix;
    }

    int main() {
        string infix;
        cout << "Enter the infix expression: ";
        cin >> infix;
        cout << "The postfix expression is: " << convertToPostfix(infix);
        return 0;
    }`, 
    cle: `
    $ g++
    $ ./a`,
    imageUrl: "image.png",
  },
  {
    title: "Eval_of_prefix",
    code: `#include<iostream>
#include<string>
using namespace std;

class Stack {
    int data[10], top;
public:
    Stack() : top(-1) {}
    void push(int val) { if (top < 9) data[++top] = val; }
    int pop() { return (top == -1) ? 0 : data[top--]; }
    bool isEmpty() { return top == -1; }
};

int prefixEval(const string& exp) {
    Stack st;
    for (int i = exp.size() - 1; i >= 0; i--) {
        if (isdigit(exp[i])) st.push(exp[i] - '0');
        else {
            int op1 = st.pop(), op2 = st.pop();
            if (exp[i] == '+') st.push(op1 + op2);
            else if (exp[i] == '-') st.push(op1 - op2);
            else if (exp[i] == '*') st.push(op1 * op2);
            else if (exp[i] == '/') st.push(op1 / op2);
        }
    }
    return st.pop();
}

int main() {
    string prefix;
    cout << "Enter the prefix expression: ";
    cin >> prefix;
    cout << "The prefix evaluation is: " << prefixEval(prefix) << endl;
    return 0;
}
`,
    cle: `
    $ g++
    $ ./a`,
    imageUrl: "image.png",
  },
  {
    title: "circular_queue_message",
    code: `#include <iostream>
#include <cstring>
using namespace std;

#define SIZE 5

class Queue {
    int front, rear;
    char data[SIZE][20];
public:
    Queue() : front(-1), rear(-1) {}

    void send(const char* item) {
        if ((front == (rear + 1) % SIZE)) {
            cout << "\nQueue full\n";
            return;
        }
        rear = (rear + 1) % SIZE;
        strcpy(data[rear], item);
        if (front == -1) front = 0;
    }

    const char* receive() {
        if (front == -1) {
            cout << "\nQueue empty\n";
            return nullptr;
        }
        const char* item = data[front];
        if (front == rear) front = rear = -1; // Reset queue if empty
        else front = (front + 1) % SIZE;
        return item;
    }

    void display() const {
        if (front == -1) {
            cout << "\nQueue empty\n";
            return;
        }
        cout << "\nQueue contents:\n";
        for (int i = front; i != rear; i = (i + 1) % SIZE)
            cout << data[i] << endl;
        cout << data[rear] << endl; // Print last element
    }
};

int main() {
    Queue q;
    while (true) {
        cout << "\n1. Send\n2. Receive\n3. Display\n4. Exit\nChoose an option: ";
        int choice;
        cin >> choice;
        cin.ignore();
        switch (choice) {
            case 1: {
                char item[20];
                cout << "Enter message: ";
                cin.getline(item, 20);
                q.send(item);
                break;
            }
            case 2: {
                const char* msg = q.receive();
                if (msg) cout << "Received: " << msg << endl;
                break;
            }
            case 3:
                q.display();
                break;
            case 4:
                return 0;
            default:
                cout << "Invalid choice. Try again.\n";
        }
    }
}
`,
    cle: `
    $ g++
    $ ./a`,
    imageUrl: "image.png",
  },
  {
    title: "poly_multiplication_using_sll",
    code: `#include <iostream>
using namespace std;

struct Node {
    int co, po;
    Node* addr;
};

Node* createNode(int co, int po) {
    return new Node{co, po, nullptr};
}

Node* insertEnd(Node* start, int co, int po) {
    Node* temp = createNode(co, po);
    if (!start) return temp;

    Node* cur = start;
    while (cur->addr) cur = cur->addr;
    cur->addr = temp;
    return start;
}

void display(Node* start) {
    if (!start) {
        cout << "Polynomial Empty\n";
        return;
    }
    while (start) {
        cout << start->co << "x^" << start->po;
        if (start->addr) cout << " + ";
        start = start->addr;
    }
    cout << endl;
}

Node* addTerm(Node* res, int co, int po) {
    for (Node* cur = res; cur; cur = cur->addr) {
        if (cur->po == po) {
            cur->co += co;
            return res;
        }
    }
    return insertEnd(res, co, po);
}

Node* multiply(Node* poly1, Node* poly2) {
    Node* res = nullptr;
    for (Node* p1 = poly1; p1; p1 = p1->addr) {
        for (Node* p2 = poly2; p2; p2 = p2->addr) {
            res = addTerm(res, p1->co * p2->co, p1->po + p2->po);
        }
    }
    return res;
}

int main() {
    Node *poly1 = nullptr, *poly2 = nullptr, *result = nullptr;
    int co, po, n;

    cout << "Enter number of terms for first polynomial: ";
    cin >> n;
    while (n--) {
        cout << "Enter coefficient and power: ";
        cin >> co >> po;
        poly1 = insertEnd(poly1, co, po);
    }

    cout << "First polynomial: ";
    display(poly1);

    cout << "Enter number of terms for second polynomial: ";
    cin >> n;
    while (n--) {
        cout << "Enter coefficient and power: ";
        cin >> co >> po;
        poly2 = insertEnd(poly2, co, po);
    }

    cout << "Second polynomial: ";
    display(poly2);

    result = multiply(poly1, poly2);
    cout << "Resultant polynomial: ";
    display(result);

    return 0;
}
`,
    cle: `
    $ g++
    $ ./a`,
    imageUrl: "Image.png",
  },
  {
    title: "queue_using_cll",
    code: `#include <iostream>
#include <cstdlib>
using namespace std;

class Node {
public:
    int data;
    Node* next;

    // Constructor
    Node(int val) : data(val), next(nullptr) {}
};

// Function to perform enqueue operation
Node* enqueue(Node* tail, int val) {
    Node* newNode = new Node(val);

    // If the queue is empty, initialize the first node
    if (!tail) {
        newNode->next = newNode;
        return newNode;
    }

    // Insert the new node at the end
    newNode->next = tail->next;
    tail->next = newNode;
    return newNode;
}

// Function to perform dequeue operation
Node* dequeue(Node* tail) {
    if (!tail) {
        cout << "No node to delete\n";
        return nullptr;
    }

    Node* del = tail->next;

    // If there is only one node
    if (tail == tail->next) {
        cout << "The deleted node is " << del->data << "\n";
        delete del;
        return nullptr;
    }

    // More than one node in the queue
    tail->next = del->next;
    cout << "The deleted node is " << del->data << "\n";
    delete del;
    return tail;
}

// Function to display the queue
void display(Node* tail) {
    if (!tail) {
        cout << "No node to display\n";
        return;
    }

    Node* curr = tail->next;
    do {
        cout << curr->data << "\t";
        curr = curr->next;
    } while (curr != tail->next);
    cout << "\n";
}

int main() {
    Node* tail = nullptr;
    int item, choice;

    cout << "1. Insert\n2. Delete\n3. Display\n4. Exit\n";

    while (true) {
        cout << "Read Choice:\n";
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Read data to be inserted: ";
                cin >> item;
                tail = enqueue(tail, item);
                break;
            case 2:
                tail = dequeue(tail);
                break;
            case 3:
                display(tail);
                break;
            case 4:
                cout << "Exiting program...\n";
                exit(0);
            default:
                cout << "Invalid choice. Try again.\n";
        }
    }

    return 0;
}
`, 
    cle: `
    $ g++
    $ ./a `,
    imageUrl: null,
  },
  {
    title: "double_hashing",
    code: `#include <iostream>
using namespace std;

const int hashTableSize = 10;
const int PrimeNumber = 7;

int firstHash(int key) {
    return key % hashTableSize;
}

int secondHash(int key) {
    return PrimeNumber - (key % PrimeNumber);
}

class HashTable {
private:
    int table[hashTableSize];

public:
    HashTable() {
        for (int i = 0; i < hashTableSize; ++i) {
            table[i] = 0;
        }
    }

    void insert(int key) {
        int hash1 = firstHash(key);
        int i = 0;
        int index = (hash1 + i * secondHash(key)) % hashTableSize;

        while (table[index] != 0) {
            i++;
            index = (hash1 + i * secondHash(key)) % hashTableSize;
        }
        table[index] = key;
    }

    void deleteKey(int key) {
        int hash1 = firstHash(key);
        int i = 0;
        int index = (hash1 + i * secondHash(key)) % hashTableSize;

        while (table[index] != key) {
            i++;
            index = (hash1 + i * secondHash(key)) % hashTableSize;
        }
        table[index] = 0;
    }

    void display() {
        for (int i = 0; i < hashTableSize; i++) {
            cout << table[i] << " ";
        }
        cout << endl;
    }
};

int main() {
    HashTable hashTable;
    hashTable.insert(5);
    hashTable.insert(15);
    hashTable.insert(25);
    hashTable.display();
    hashTable.deleteKey(15);
    hashTable.display();
    return 0;
}
`, 
    cle: `
    $ g++
    $ ./a `,
    imageUrl: null,
  },
    { title: 'priority_queue', code: `#include <iostream>
using namespace std;

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i;
    int right = 2 * i + 1;

    if (left <= n && arr[left] > arr[largest])
        largest = left;

    if (right <= n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void makeHeap(int arr[], int n) {
    for (int i = n / 2; i >= 1; i--) {
        heapify(arr, n, i);
    }
}

void extractMax(int arr[], int &n) {
    if (n < 1) {
        cout << "Heap is empty\n";
        return;
    }

    cout << "Max element: " << arr[1] << "\n";
    arr[1] = arr[n--];
    heapify(arr, n, 1);
}

void displayHeap(int arr[], int n) {
    for (int i = 1; i <= n; i++) {
        cout << arr[i] << " ";
    }
    cout << "\n";
}

int main() {
    int arr[10] = {0, 10, 20, 5, 6, 1, 8, 9, 4}; // Sample array, 1-based index
    int n = 8; // Number of elements in the heap

    makeHeap(arr, n);
    cout << "Heap created:\n";
    displayHeap(arr, n);

    extractMax(arr, n);
    cout << "Heap after extracting max:\n";
    displayHeap(arr, n);

    return 0;
}
`,
    cle: `
    $ g++
    $ ./a`,
    imageUrl: "Diningph.png",
  },
  {
    title: "Exp_tree",
    code: `#include <iostream>
#include <cctype>
#include <string>
using namespace std;

class Node {
public:
    char data;
    Node* left;
    Node* right;

    Node(char val) : data(val), left(nullptr), right(nullptr) {}
};

class Stack {
    Node* ele[20];
    int top;

public:
    Stack() : top(-1) {}

    void push(Node* node) {
        ele[++top] = node;
    }

    Node* pop() {
        return ele[top--];
    }

    char topElement() const {
        return ele[top]->data;
    }

    bool isEmpty() const {
        return top == -1;
    }
};

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->data << " ";
    inorder(root->right);
}

void preorder(Node* root) {
    if (!root) return;
    cout << root->data << " ";
    preorder(root->left);
    preorder(root->right);
}

void postorder(Node* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->data << " ";
}

int precedence(char op) {
    if (op == '^') return 3;
    if (op == '*' || op == '/') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

Node* createExpressionTree(const string& exp) {
    Stack operators, operands;

    for (char var : exp) {
        Node* node = new Node(var);
        if (isalnum(var)) {
            operands.push(node);
        } else {
            while (!operators.isEmpty() && precedence(operators.topElement()) >= precedence(var)) {
                Node* temp = operators.pop();
                temp->right = operands.pop();
                temp->left = operands.pop();
                operands.push(temp);
            }
            operators.push(node);
        }
    }

    while (!operators.isEmpty()) {
        Node* temp = operators.pop();
        temp->right = operands.pop();
        temp->left = operands.pop();
        operands.push(temp);
    }
    return operands.pop();
}

int main() {
    string infix;
    cout << "Enter infix expression: ";
    cin >> infix;

    Node* root = createExpressionTree(infix);

    cout << "Inorder Traversal: ";
    inorder(root);
    cout << "\nPreorder Traversal: ";
    preorder(root);
    cout << "\nPostorder Traversal: ";
    postorder(root);
    cout << endl;

    return 0;
}
`,
    cle: `
    $ g++
    $ ./a`,
    imageUrl: "Producersconsumers.png",
  },
  {
    title: "BT",
    code: `#include <iostream>
using namespace std;

class Tree {
public:
    int data;
    Tree* left;
    Tree* right;

    Tree(int val) : data(val), left(nullptr), right(nullptr) {}
};

void inOrder(Tree* root) {
    if (root == nullptr) return;
    inOrder(root->left);
    cout << root->data << "\t";
    inOrder(root->right);
}

void preOrder(Tree* root) {
    if (root == nullptr) return;
    cout << root->data << "\t";
    preOrder(root->left);
    preOrder(root->right);
}

void postOrder(Tree* root) {
    if (root == nullptr) return;
    postOrder(root->left);
    postOrder(root->right);
    cout << root->data << "\t";
}

Tree* constructBinaryTree(Tree* root) {
    int val;
    cout << "Enter the data (to enter null : -1): ";
    cin >> val;
    if (val == -1) return nullptr;
    root = new Tree(val);
    cout << "Enter the value to the left of " << val << endl;
    root->left = constructBinaryTree(root->left);
    cout << "Enter the value to the right of " << val << endl;
    root->right = constructBinaryTree(root->right);
    return root;
}

int countNodes(Tree* root) {
    if (root == nullptr) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}

int leafNodes(Tree* root) {
    if (root == nullptr) return 0;
    if (root->left == nullptr && root->right == nullptr) return 1;
    return leafNodes(root->left) + leafNodes(root->right);
}

int height(Tree* root) {
    if (root == nullptr) return 0;
    return 1 + max(height(root->left), height(root->right));
}

int main() {
    Tree* root = nullptr;
    int choice;

    do {
        cout << "\nMenu: \n1. Create tree \n2. Display tree (inorder) \n3. Count nodes \n4. Calculate height \n5. Count leaf nodes \n6. Count non-leaf nodes \n7. Exit \nEnter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                root = constructBinaryTree(root);
                cout << "Tree created successfully." << endl;
                break;
            case 2:
                cout << "\nDisplaying tree (inorder): ";
                inOrder(root);
                cout << endl;
                break;
            case 3:
                cout << "\nTotal number of nodes: " << countNodes(root) << endl;
                break;
            case 4:
                cout << "\nHeight of the tree: " << height(root) << endl;
                break;
            case 5:
                cout << "\nTotal number of leaf nodes: " << leafNodes(root) << endl;
                break;
            case 6:
                cout << "\nTotal number of non-leaf nodes: " << countNodes(root) - leafNodes(root) << endl;
                break;
            case 7:
                cout << "Exiting..." << endl;
                break;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 7);

    return 0;
}
`,
    cle: `
    $ g++
    $ ./a`,
    imageUrl: "Readerswriters.png",
  },
  {
    title: "BST",
    code: `#include <iostream>
using namespace std;

class Tree {
public:
    int data;
    Tree* left;
    Tree* right;

    Tree(int val) {
        this->data = val;
        this->left = nullptr;
        this->right = nullptr;
    }
};

// Corrected function to find the inorder predecessor
Tree* predecessor(Tree* node) {
    node = node->left;
    while (node && node->right != nullptr) {
        node = node->right;
    }
    return node;
}

// Function to delete a node in the BST
Tree* delete_in_bst(Tree* root, int val) {
    if (root == nullptr) {
        return nullptr;
    }

    if (root->data > val) {
        root->left = delete_in_bst(root->left, val);
    } else if (root->data < val) {
        root->right = delete_in_bst(root->right, val);
    } else {
        // Node with only one child or no child
        if (root->left == nullptr) {
            Tree* temp = root->right;
            delete root;
            return temp;
        } else if (root->right == nullptr) {
            Tree* temp = root->left;
            delete root;
            return temp;
        }

        // Node with two children: Get the inorder predecessor
        Tree* temp = predecessor(root);
        root->data = temp->data;
        root->left = delete_in_bst(root->left, temp->data);
    }
    return root;
}

// Function to insert a value into the BST
Tree* insert_into_bst(Tree* root, int val) {
    if (root == nullptr) {
        return new Tree(val);
    }
    if (root->data < val) {
        root->right = insert_into_bst(root->right, val);
    } else if (root->data > val) {
        root->left = insert_into_bst(root->left, val);
    }
    return root;
}

// Function to create the BST
Tree* create_bst(Tree* root) {
    int val;
    cout << "Enter the data to be inserted in the BST (Enter -1 to stop): ";
    cin >> val;
    while (val != -1) {
        root = insert_into_bst(root, val);
        cout << "Enter the data to be inserted in the BST (Enter -1 to stop): ";
        cin >> val;
    }
    return root;
}

// Traversals
void inOrder(Tree* root) {
    if (root == nullptr) return;
    inOrder(root->left);
    cout << root->data << "\t";
    inOrder(root->right);
}

void preOrder(Tree* root) {
    if (root == nullptr) return;
    cout << root->data << "\t";
    preOrder(root->left);
    preOrder(root->right);
}

void postOrder(Tree* root) {
    if (root == nullptr) return;
    postOrder(root->left);
    postOrder(root->right);
    cout << root->data << "\t";
}

int main() {
    Tree* root = nullptr;
    int choice, item, key;

    while (true) {
        cout << "\nMenu:\n"
             << "1. Create BST\n"
             << "2. Insert\n"
             << "3. Preorder Traversal\n"
             << "4. Inorder Traversal\n"
             << "5. Postorder Traversal\n"
             << "6. Delete\n"
             << "7. Exit\n"
             << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "\nCreate BST:";
                root = create_bst(root);
                break;
            case 2:
                cout << "\nEnter element to be inserted: ";
                cin >> item;
                root = insert_into_bst(root, item);
                break;
            case 3:
                cout << "\nPreorder Traversal:\n";
                preOrder(root);
                cout << endl;
                break;
            case 4:
                cout << "\nInorder Traversal:\n";
                inOrder(root);
                cout << endl;
                break;
            case 5:
                cout << "\nPostorder Traversal:\n";
                postOrder(root);
                cout << endl;
                break;
            case 6:
                cout << "\nEnter node to be deleted: ";
                cin >> key;
                root = delete_in_bst(root, key);
                break;
            case 7:
                cout << "Exiting...\n";
                return 0;
            default:
                cout << "Invalid choice. Please try again.\n";
        }
    }
    return 0;
}
`,
    cle: `
    $ g++
    $ ./a`,
    imageUrl: null,
  },
];

export default experiments;
