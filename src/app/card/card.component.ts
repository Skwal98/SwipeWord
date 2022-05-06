import {
  Component,
  OnInit,
  Input,
  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  filter,
  finalize,
  fromEvent,
  map,
  pairwise,
  scan,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { IWord } from '../app.component';

const ALLOW_UP = 300;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input('isActive') isActive = false;
  @Input('word') word!: IWord;
  @Output('dropped') dropped = new EventEmitter<boolean>();

  shift!: number;

  @HostBinding('style.transform') get transform() {
    const rotate = this.shift / 25;
    return `rotate(${rotate}deg) translateX(${this.shift * 1}px) translateY(-${
      Math.abs(this.shift) / 10
    }px)`;
  }
  isMouseDown: boolean = false;

  @HostBinding('style.transition') get getCursor() {
    return this.isMouseDown ? '0s' : '';
  }

  constructor() {}

  ngOnInit(): void {
    //touchmove
    //  fromEvent(window, 'touchstart').subscribe((x) => console.log(x));
    fromEvent(window, 'mousedown')
      .pipe(
        filter(() => this.isActive),
        switchMap(() =>
          fromEvent<MouseEvent>(window, 'mousemove').pipe(
            tap(() => (this.isMouseDown = true)),
            finalize(() => this.onCardUp()),
            takeUntil(fromEvent(window, 'mouseup')),
            pairwise(),
            map(([a, b]) => b.x - a.x),
            scan((x: number, v: number, i) => {
              if (v > 0) {
                return x + v;
              } else if (v < 0) {
                return x + v;
              }
              return x;
            }, 0)
          )
        )
      )
      .subscribe((x) => {
        this.shift = x;
      });
  }

  onCardUp(): void {
    this.isMouseDown = false;
    if (Math.abs(this.shift) > ALLOW_UP) {
      this.dropped.next(this.shift > 0);
    } else {
      this.shift = 0;
    }
  }
}
