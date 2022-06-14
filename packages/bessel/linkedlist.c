#include "linkedlist.h";

#define MIN_INT64_VALUE  -9223372036854775808
#define MAX_INT64_VALUE   9223372036854775807

static void copyLinkedListItem(LinkedListItem *src, LinkedListItem * target){
    target->prev = src->prev;
    target->next = src->next;
    target->value = src->value;
}


LinkedListItem * llseek(LinkedListItem *list, int64_t count){
    while (count != 0){
        if (count > 0){
            if (list->next == NULL){
                break;
            }
            count--;
            list = list->next;
            continue;
        }
        // count < 0
        if (list->next == NULL){
           break;
        }
        count++;
        list = list->prev;
    }
    return list;
}

LinkedListItem * llstart(LinkedListItem *list){
    return llseek(list, MIN_INT64_VALUE);
}

LinkedListItem * llend(LinkedListItem *list){
    return llseek(list, MAX_INT64_VALUE);
}

LinkedListItem * llInsertAfter(LinkedListItem *list, void * value){
    LinkedListItem * const li = malloc(sizeof(LinkedListItem));
    li->prev = list;
    li->next = list->next;
    list->next = li;
    if (li->next){
        li->next->prev = li;
    }
    li->value = value;
    return li;
}

LinkedListItem * llInsertBefore(LinkedListItem *list, void * value){
    LinkedListItem * const li = malloc(sizeof(LinkedListItem));
    
    li->next = list;
    li->prev = list->prev;
    list->prev = li;
    if (li->prev){
        li->prev->next = li;
    }
    li->value = value;
    return li;
}


LinkedListItem * llremove(LinkedListItem *list){
    //   0     *     0
    //1. A <-> B <-> C
    //2. 0 |<- B <-> C
    //3. 0 |<- B ->| C
    if (list->prev){
        //1. A -> C
        list->prev->next = list->next;
    }
    
    if (list->next){
        //1.  A <- C
        //2. 0 |<- C
        list->next->prev = list->prev;
    }
    if (list-next){
        return list-next;
    }
    if (list-prev){
        return  list-prev;
    }

    // if you are here, then it was the only element in the list, removing this will effectively destroy the list
    free(list);
    return null; // all elements in the list are gone
}

// add to the beginning of the list
LinkedListItem * llunshift(LinkedListItem *list, void * const value){
    LinkedListItem * start = llstart(list);
    return llInsertBefore(start, value);
}

// remove from the beginning of the list
// free the memory of the object returned
void * llshift(LinkedListItem *list){
    LinkedListItem * start = llstart(list);
    const value = start->value;
    llremove(start);
    return value;
}

// append at the end of the list
LinkedListItem * llpush(LinkedListItem *list, void * const value){
    LinkedListItem * end = llend(list);
    LinkedListItem * li = llInsertAfter(end, value);
    return li;
}

// 
LinkedListItem * llpop(LinkedListItem *list){
    LinkedListItem * end = llend(list);
    LinkedListItem * const li = malloc(sizeof(LinkedListItem));
    copyLinkedListItem(end, li);
    llremove(end);
    return li;
}

// typedef void (*printer_t)(int);

typedef bool (*predicate_fun)(LinkedListItem * list, int index);

LinkedListItem *searchForward(LinkedListItem *list, predicate_fun fn) {
    int idx = 0;
    while (list){
        const bool rc = fn(list, idx++);
        if (rc){
            break;
        }
        list = list->next;
    }
    return list;
}



LinkedListItem *searchReverse(LinkedListItem *list, predicate_fun fn) {
    int idx = 0;
    while (list){
        const bool rc = fn(list, idx++);
        if (rc){
            break;
        }
        list = list->prev;
    }
    return list;
}
