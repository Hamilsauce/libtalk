const { iif, ReplaySubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { toArray, concatMap, groupBy, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch, } = rxjs.fetch;




export class App {
  constructor(el = document.querySelector('#app'), chatDataUrl = './loosy-goosy.json') {
    this.root = el;
    this.chatDataUrl = chatDataUrl;
    this.listStats = document.querySelector('#list-stats');
    this.avgEls = this.listStats.querySelectorAll('.avg');

    this.chatMembers = new Map([
      ['jake', (val) => { this.avgEls[0].querySelector('.avg-value').textContent = `${ Math.round(val) }%`; }],
      ['nikki', (val) => this.avgEls[1].querySelector('.avg-value').textContent = `${ Math.round(val) }%`],
      ['jake', (val) => this.avgEls[2].querySelector('.avg-value').textContent = `${ Math.round(val) }%`]]);

    this.chatData$ = new Subject()
      .pipe(

        mergeMap(messageGroup => {
          console.log('group', messageGroup);
          return messageGroup.pipe(
            // tap(x => console.log('x', x)),
            // filter(_ => {//   return _.every((x, i) => {
            //   return _.hasOwnProperty('from_id')
            //   //   });
            toArray(),
            map(group => {
              const agg = [group[0]['from_id'] ? group[0]['from_id'] : group[0]['actor_id'],
              (group.length / app.chatLength) * 100];
              return agg;
            }),
            // take(1),
          );
        }),
        // tap(console.log),
      );


    this.chatDataFetch$ = fromFetch(this.chatDataUrl)
      .pipe(
        mergeMap(_ => _.json()),
        mergeMap(({ chat }) => {
          this.chatLength = chat.messages.length;
          return from(chat.messages)
            .pipe(
              // groupBy(_ => _[0].from_id ? _[0].from_id : _[0].actor_id),
              groupBy(_ => _.from_id ? _.from_id : _.actor_id));
          // filter(arr => arr.some(_ => _.hasOwnProperty('from_id'))),
          // tap(x => console.log('x line 53', x)),
        }),
      ).subscribe(this.chatData$);
    // tap(x => console.log('x line60', x)),
    // .pipe(tap(x => console.log('MADE IT', x)




    // this.chatData$.pipe(tap(x => console.log('IN CHATDATA PIPE', x)), ).subscribe()
    this.jake$ = this.chatData$.pipe(
      filter(([key, val]) => key === 'user523989469'),
      // tap(x => console.log('x', x)),
      // tap(([key, val]) => {
      // tap(([key, val]) => this.chatMembers.get('jake')(val)),
      // tap((_) => this.update(_)),
      tap(([key, val]) => {
        document.querySelector('#avg-jake').children[1].textContent = `${ Math.round(val) }%`;
      }));

    this.andrew$ = this.chatData$.pipe(
      filter(([key, val]) => key === 'user607737809'),
      tap(x => console.log('in andy', x)),
      tap(([key, val]) => {
        // tap(([key, val]) => this.chatMembers.get('andrew')(val)),
        tap((_) => this.update(_)),
          document.querySelector('#avg-andrew').children[1].textContent = `${ Math.round(val) }%`;
      })
    );

    this.nikki$ = this.chatData$.pipe(
      tap(x => console.log('in nikki', x)),
      filter(([key, val]) => key === 'user1784805051'),

      tap(([key, val]) => {
        document.querySelector('#avg-nikki').children[1].textContent = `${ Math.round(val) }%`;
      })

    );
    // tap(x => console.log('nikki', x)),
    // tap((_) => this.update(_))

    this.mapper$ = merge(this.jake$, this.andrew$, this.nikki$);


    // merge(this.jake$, this.andrew$, this.nikki$).subscribe()

    // this.mapper$.subscribe(console.log)

    // .pipe(tap(x => console.log('MADE IT', x))).subscribe()

    this.subscription = this.mapper$.subscribe();



  };


  update([k, v]) {
    console.log('[k, v]) {', [k, v]);
    console.log('chatMembers.get(k)', this.chatMembers.get(k));
    this.chatMembers.get(k)(v);
  }
  get prop() { return this._prop; };
  set prop(newValue) { this._prop = newValue; };

  get data$() { return; }
}


const app = new App();