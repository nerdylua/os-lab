const experiments = [
  {
    title: "ls command",
    code: `
    #include <stdio.h>
    #include <dirent.h>
    #include <sys/stat.h>
    #include <pwd.h>
    #include <grp.h>
    #include <time.h>

    int main() {
        DIR *d = opendir(".");
        struct dirent *de;
        struct stat buf;
        char time[26];
        
        while ((de = readdir(d)) != NULL) {
            stat(de->d_name, &buf);
            printf(S_ISDIR(buf.st_mode) ? "d" : "-");

            for (int i = 0; i < 9; i++) {
                printf(buf.st_mode & (1 << (8 - i)) ? "rwx"[i % 3] : "-");
            }

            printf(" %5d %.8s %-8.8s %8d ", buf.st_nlink, 
                  getpwuid(buf.st_uid)->pw_name, getgrgid(buf.st_gid)->gr_name, buf.st_size);
            
            strftime(time, sizeof(time), "%b %d %H:%M", localtime(&buf.st_mtime));
            printf("%s %s\n", time, de->d_name);
        }
        closedir(d);
        return 0;
    }
        `, 
    cle: `
    $ gcc ls.c
    $ ./a.out`,
    imageUrl: "image.png",
  },
  {
    title: "cp command",
    code: `
    #include <stdio.h>
    #include <stdlib.h>
    #include <fcntl.h>
    #include <unistd.h>

    #define BUF_SIZE 8192

    int main(int argc, char *argv[]) {
        int input_fd, output_fd;
        ssize_t ret_in, ret_out;
        char buffer[BUF_SIZE];
        
        if (argc != 3) {
            printf("Usage: cp file1 file2");
            return 1;
        }
        
        input_fd = open(argv[1], O_RDONLY);
        if (input_fd == -1) {
            perror("open");
            return 2;
        }
        
        output_fd = open(argv[2], O_WRONLY | O_CREAT, 0644);
        if (output_fd == -1) {
            perror("open");
            return 3;
        }
        
        while ((ret_in = read(input_fd, buffer, BUF_SIZE)) > 0) {
            ret_out = write(output_fd, buffer, ret_in);
            if (ret_out != ret_in) {
                perror("write");
                return 4;
            }
        }
        
        close(input_fd);
        close(output_fd);
        return 0;
    }
    `,
    cle: `
    $ gcc cp.c
    $ ./a.out file1 file2`,
    imageUrl: "image.png",
  },
  {
    title: "mv command",
    code: `#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("Usage: mv file1 file2");
        return 1;
    }

    if (link(argv[1], argv[2]) == -1) {
        perror("link error");
        return 2;
    }

    if (unlink(argv[1]) == -1) {
        perror("unlink");
        return 3;
    }

    return 0;
}
`,
    cle: `
    $ gcc mv.c
    $ ./a.out file1 file2`,
    imageUrl: "image.png",
  },
  {
    title: "rm command",
    code: `
    #include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    if (unlink(argv[1]) == -1) {
        perror("unlink error");
        return 3;
    }
    return 0;
}
`,
    cle: `
    $ gcc rm.c
    $ ./a.out file1`,
    imageUrl: "Image.png",
  },
  {
    title: "Process Control System Calls",
    code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <wait.h>

int binarySearch(int arr[], int l, int r, int x) {
    if (r >= l) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == x) return 1;
        if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x);
        return binarySearch(arr, mid + 1, r, x);
    }
    return -1;
}

void sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
}

int main(int argc, char *argv[]) {
    pid_t pid = fork();

    if (pid < 0) {
        printf("Fork failed\n");
        return 1;
    }

    if (pid == 0) {
        int n, key, arr[10];
        printf("Enter number of elements: ");
        scanf("%d", &n);
        printf("Enter elements: ");
        for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
        
        sort(arr, n);
        printf("Enter element to search: ");
        scanf("%d", &key);

        if (binarySearch(arr, 0, n - 1, key) == -1)
            printf("Element not found\n");
        else
            printf("Element found\n");
    } else {
        wait(NULL);
        printf("Parent process finished.\n");
    }

    return 0;
}
 `, 
    cle: `
    $ gcc ProcessControl.c
    $ ./a.out `,
    imageUrl: null,
  },
  {
    title: "Thread management using Pthreads",
    code: `#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>
#include <unistd.h>

int a[4][4], b[4][4];

void *matrixeval(void *val) {
    int thno = *(int*)val;
    for (int i = 0; i < 4; i++) {
        b[thno][i] = a[thno][i];
        for (int j = 0; j < thno; j++) {
            b[thno][i] *= a[thno][i];
        }
    }
    printf("Thread %d finished\n", thno + 1);
    return NULL;
}

int main() {
    pthread_t tid[4];
    int row_indices[4];

    for (int i = 0; i < 4; i++) {
        printf("Enter elements of row %d: ", i + 1);
        for (int j = 0; j < 4; j++)
            scanf("%d", &a[i][j]);
    }

    printf("Before processing:\n");
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++)
            printf("%d ", a[i][j]);
        printf("\n");
    }

    for (int i = 0; i < 4; i++) {
        row_indices[i] = i;
        pthread_create(&tid[i], NULL, matrixeval, &row_indices[i]);
        sleep(1);
    }

    for (int i = 0; i < 4; i++) {
        pthread_join(tid[i], NULL);
        sleep(1);
    }

    printf("After processing:\n");
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 4; j++)
            printf("%d ", b[i][j]);
        printf("\n");
    }

    return 0;
}
`, 
    cle: `
    $ gcc ThreadManage.c -pthread
    $ ./a.out `,
    imageUrl: null,
  },
    { title: 'Dining philosophers problem', code: `#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <unistd.h>

#define N 5
#define THINKING 2
#define HUNGRY 1
#define EATING 0
#define LEFT (phnum + 4) % N
#define RIGHT (phnum + 1) % N

int state[N];
int phil[N] = { 0, 1, 2, 3, 4 };
sem_t mutex, S[N];

void test(int phnum) {
    if (state[phnum] == HUNGRY && state[LEFT] != EATING && state[RIGHT] != EATING) {
        state[phnum] = EATING;
        sleep(2);
        printf("Philosopher %d is Eating\n", phnum + 1);
        sem_post(&S[phnum]);
    }
}

void take_fork(int phnum) {
    sem_wait(&mutex);
    state[phnum] = HUNGRY;
    printf("Philosopher %d is Hungry\n", phnum + 1);
    test(phnum);
    sem_post(&mutex);
    sem_wait(&S[phnum]);
    sleep(1);
}

void put_fork(int phnum) {
    sem_wait(&mutex);
    state[phnum] = THINKING;
    printf("Philosopher %d is Thinking\n", phnum + 1);
    test(LEFT);
    test(RIGHT);
    sem_post(&mutex);
}

void* philosopher(void* num) {
    while (1) {
        int* i = num;
        sleep(1);
        take_fork(*i);
        sleep(0);
        put_fork(*i);
    }
}

int main() {
    int i;
    pthread_t thread_id[N];
    sem_init(&mutex, 0, 1);
    for (i = 0; i < N; i++) 
        sem_init(&S[i], 0, 0);

    for (i = 0; i < N; i++) {
        pthread_create(&thread_id[i], NULL, philosopher, &phil[i]);
        printf("Philosopher %d is thinking\n", i + 1);
    }
    for (i = 0; i < N; i++) 
        pthread_join(thread_id[i], NULL);

    return 0;
}
`,
    cle: `
    $ gcc DiningPh.c -pthread 
    $ ./a.out`,
    imageUrl: "Diningph.png",
  },
  {
    title: "Producer-Consumer problem",
    code: `#include <stdio.h>
#include <semaphore.h>
#include <pthread.h>
#include <stdlib.h>
#include <unistd.h>

#define BUFFERSIZE 10

pthread_mutex_t mutex;
pthread_t tidP[20], tidC[20];  // Producers, consumers
sem_t full, empty;              // Semaphores to control full/empty state in buffer
int counter;                    // Track number of items in buffer
int buffer[BUFFERSIZE];         // The buffer itself

// Initialize semaphores and mutex variables
void initialize() {
    pthread_mutex_init(&mutex, NULL);
    sem_init(&full, 0, 0);        // Initially, no items in the buffer
    sem_init(&empty, 0, BUFFERSIZE); // Initially, buffer is empty
    counter = 0;
}

void write(int item) {
    buffer[counter++] = item;
}

int read() {
    return buffer[--counter];
}

// Producer process
void* producer(void* param) {
    int item, i;
    item = rand() % 5;  // Produce a random item
    sem_wait(&empty);    // If buffer is full, producer waits
    pthread_mutex_lock(&mutex); // Mutual exclusion to write to buffer
    printf("\nProducer produced item: %d\n", item);
    write(item);         // Add item to buffer
    pthread_mutex_unlock(&mutex); // Unlock mutex
    sem_post(&full);     // Increment full semaphore, indicating buffer is not empty
    return NULL;
}

// Consumer process
void* consumer(void* param) {
    int item;
    sem_wait(&full);     // If buffer is empty, consumer waits
    pthread_mutex_lock(&mutex); // Mutual exclusion to read from buffer
    item = read();       // Remove item from buffer
    printf("\nConsumer consumed item: %d\n", item);
    pthread_mutex_unlock(&mutex); // Unlock mutex
    sem_post(&empty);    // Increment empty semaphore, indicating buffer is not full
    return NULL;
}

int main() {
    int n1, n2, i;

    // Initialize resources
    initialize();

    printf("\nEnter the number of producers: ");
    scanf("%d", &n1);
    printf("\nEnter the number of consumers: ");
    scanf("%d", &n2);

    // Create producer threads
    for (i = 0; i < n1; i++)
        pthread_create(&tidP[i], NULL, producer, NULL);

    // Create consumer threads
    for (i = 0; i < n2; i++)
        pthread_create(&tidC[i], NULL, consumer, NULL);

    // Wait for all producer threads to finish
    for (i = 0; i < n1; i++)
        pthread_join(tidP[i], NULL);

    // Wait for all consumer threads to finish
    for (i = 0; i < n2; i++)
        pthread_join(tidC[i], NULL);

    // Clean up
    pthread_mutex_destroy(&mutex);
    sem_destroy(&full);
    sem_destroy(&empty);

    return 0;
}
`,
    cle: `
    $ gcc ProducerConsumer.c -pthread 
    $ ./a.out`,
    imageUrl: "Producersconsumers.png",
  },
  {
    title: "Reader-Writer problem",
    code: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>  // Semaphore operations

int count = 0, rcount = 0;  // Page number, number of readers
sem_t mutex, wr;            // Semaphore for mutual exclusion and writer access

void* writer(void *p) {
    int* i = (int*)p;
    sem_wait(&wr);  // Blocks writer access to 'count' until it acquires 'wr'
    printf("\nWriter %d writes page number %d", *i, ++count);
    sem_post(&wr);  // Releases 'wr' to allow other writer threads
}

void* reader(void* p) {
    int* i = (int*)p;
    sem_wait(&mutex);  // Mutual exclusion to allow only one reader to modify 'rcount' at a time
    rcount++;
    if (rcount == 1) {
        sem_wait(&wr);  // Blocks writer access to 'count' until the reader has started
    }
    sem_post(&mutex);  // Releases 'mutex' semaphore to allow other reader threads

    printf("\nReader %d reads page number %d", *i, count);

    sem_wait(&mutex);  // Mutual exclusion to modify 'rcount'
    rcount--;
    if (rcount == 0) {
        sem_post(&wr);  // Releases 'wr' semaphore to allow writer threads
    }
    sem_post(&mutex);  // Releases 'mutex' to allow other readers to modify 'rcount'
}

int main() {
    // Initialize semaphores
    sem_init(&mutex, 0, 1);  // Mutex for mutual exclusion on reader count
    sem_init(&wr, 0, 1);     // Writer access control semaphore

    int a[6] = {1, 2, 3, 1, 2, 3};  // Writer and Reader IDs
    pthread_t p[6];  // Thread IDs for writers and readers

    // Create writer threads
    for (int i = 0; i < 3; i++) {
        pthread_create(&p[i], NULL, writer, &a[i]);
    }

    // Create reader threads
    for (int i = 3; i < 6; i++) {
        pthread_create(&p[i], NULL, reader, &a[i]);
    }

    // Wait for all threads to finish
    for (int i = 0; i < 6; i++) {
        pthread_join(p[i], NULL);
    }

    // Cleanup semaphores
    sem_destroy(&mutex);
    sem_destroy(&wr);

    return 0;
}
`,
    cle: `
    $ gcc ReaderWriter.c -pthread
    $ ./a.out`,
    imageUrl: "Readerswriters.png",
  },
  {
    title: "Process/thread synchronisation using File locks",
    code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h> // file control
#include <errno.h>

int main(int argc, char *argv[]) {
    int fd; // file descriptor to perform operations on file
    char buffer[255];
    struct flock fvar; // file lock structure

    // If src file not specified
    if (argc == 1) {
        printf("Usage: %s filename\n", argv[0]);
        return -1;
    }

    // Open the file with read/write permissions
    if ((fd = open(argv[1], O_RDWR)) == -1) {
        perror("open");
        exit(1);
    }

    // Set up the write lock
    fvar.l_type = F_WRLCK; // Type - write lock
    fvar.l_whence = SEEK_END; // Relative offset - end of file
    fvar.l_start = SEEK_END - 100; // Starting offset (last 100 bytes)
    fvar.l_len = 100; // Lock length

    printf("Press enter to set lock\n");
    getchar(); // Wait for user input
    printf("Trying to get lock...\n");

    // Try to acquire the lock
    if ((fcntl(fd, F_SETLK, &fvar)) == -1) {
        fcntl(fd, F_GETLK, &fvar);
        printf("\nFile already locked by process (pid): %d\n", fvar.l_pid);
        return -1;
    }
    printf("Locked\n");

    // Move the file pointer to read the last 100 bytes
    if ((lseek(fd, SEEK_END - 50, SEEK_END)) == -1) {
        perror("lseek");
        exit(1);
    }

    // Read data from the file
    if ((read(fd, buffer, 100)) == -1) {
        perror("read");
        exit(1);
    }

    printf("Data read from file:\n");
    puts(buffer); // Output the read data

    // Wait for user input before releasing the lock
    printf("Press enter to release lock\n");
    getchar();

    // Unlock the file
    fvar.l_type = F_UNLCK; // Unlock file
    fvar.l_whence = SEEK_SET; // Reset to the beginning of the file
    fvar.l_start = 0;
    fvar.l_len = 0;

    // Release the lock
    if ((fcntl(fd, F_UNLCK, &fvar)) == -1) {
        perror("fcntl");
        exit(0);
    }

    printf("Unlocked\n");
    close(fd); // Close the file descriptor
    return 0;
}
`,
    cle: `
    $ gcc Filelocks.c
    $ ./a.out filename`,
    imageUrl: null,
  },
  {
    title: "Creation and use of Static and Shared libraries",
    code: `
    /* add.c */
    int add(int quant1, int quant2)
    {
      return(quant1 + quant2);
    }

    /* sub.c */
    int sub(int quant1, int quant2)
    {
      return(quant1 - quant2);
    }

    /* math1.h -library file that contains function declarations */
    int add(int, int); //adds two integers
    int sub(int, int); //subtracts second integer from first
    
    /* opDemo.c */
    #include <math1.h>
    #include <stdio.h>
 
    int main()
    {
     int x,y;
     printf("Enter values for x and y: ");
     scanf("%d %d",&x,&y);
     printf("%d + %d = %d \\n", x, y, add(x, y));
     printf("%d - %d = %d \\n", x, y, sub(x, y));
     return 0;
    }
    
    /* Static Linking
    ar rs libmath1.a add.o sub.o  //link object files to library file (prefix- lib) (extension- .a for static)
    */

    /* Dynamic Linking 
    gcc -shared -o libmath1.so add.o sub.o //link object files to library file (prefix- lib) (extension- .so for shared)
    */
    `,
    cle: `
    /* Static Linking */
    gcc -c add.c  
    gcc -c sub.c
    ar rs libmath1.a add.o sub.o
    gcc -o opDemo opDemo.o libmath1.a 
    ./opDemo

    /* Dynamic Linking */
    gcc -Wall -fPIC -c add.c
    gcc -Wall -fPIC -c sub.c
    gcc -shared -o libmath1.so add.o sub.o
    gcc -o opDemo opDemo.o libmath1.so 
    ./opDemo`,
    imageUrl: null,
  },
  
];

export default experiments;
