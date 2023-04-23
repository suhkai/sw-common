implement main

domains
    gender = female; male.

class facts - familyDB
    person : (string Name, gender Gender).
    parent : (string Person, string Parent).

class predicates
    father : (string Person, string Father) nondeterm anyflow.
clauses
    father(Person, Father) :-
        parent(Person, Father),
        person(Father, male).

class predicates
    grandFather : (string Person [out], string GrandFather [out]) nondeterm.
clauses
    grandFather(Person, GrandFather) :-
        parent(Person, Parent),
        father(Parent, GrandFather).

class predicates
    ancestor : (string Person, string Ancestor [out]) nondeterm.
clauses
    ancestor(Person, Ancestor) :-
        parent(Person, Ancestor).
    ancestor(Person, Ancestor) :-
        parent(Person, P1),
        ancestor(P1, Ancestor).

class predicates
    reconsult : (string FileName).
clauses
    reconsult(FileName) :-
        retractFactDB(familyDB),
        file::consult(FileName, familyDB).

clauses
    run() :-
        console::init(),
        stdio::write("Load data\n"),
        reconsult(@"..\fa.txt"),
        stdio::write("\nfather test\n"),
        father(X, Y),
        stdio::writef("% is the father of %\n", Y, X),
        fail.

    run() :-
        stdio::write("\ngrandFather test\n"),
        grandFather(X, Y),
        stdio::writef("% is the grandfather of %\n", Y, X),
        fail.

    run() :-
        stdio::write("\nancestor of Pam test\n"),
        X = "Pam",
        ancestor(X, Y),
        stdio::writef("% is the ancestor of %\n", Y, X),
        fail.

    run() :-
        stdio::write("End of test\n").

end implement main

goal
    mainExe::run(main::run).
