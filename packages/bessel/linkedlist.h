#ifndef __LINKEDLIST_H
#define  __LINKEDLIST_H

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <stdint.h>

typedef struct _LinkedListItem {
    struct _LinkedListItem * prev;
    struct _LinkedListItem * next;
    void * value;
} LinkedListItem;

typedef bool (*predicate_fun)(LinkedListItem * list, int index);

LinkedListItem * llseek(LinkedListItem *list, int64_t count);
LinkedListItem * llstart(LinkedListItem *list);
LinkedListItem * llend(LinkedListItem *list);
LinkedListItem * llInsertAfter(LinkedListItem *list, void * value);
LinkedListItem * llInsertBefore(LinkedListItem *list, void * value);
LinkedListItem * llremove(LinkedListItem *list);
LinkedListItem * llunshift(LinkedListItem *list, void * const value);
LinkedListItem * llshift(LinkedListItem *list);
LinkedListItem * llpush(LinkedListItem *list, void * const value);
LinkedListItem * llpop(LinkedListItem *list);
LinkedListItem * searchForward(LinkedListItem *list, predicate_fun fn);
LinkedListItem * searchReverse(LinkedListItem *list, predicate_fun fn);
#endif

