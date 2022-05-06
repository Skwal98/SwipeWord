import { ChangeDetectorRef, Component } from '@angular/core';

const VISIBLE_CARDS = 3;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private _cardSource: IWord[] = [
    {
      english: 'Car',
      russian: 'Машина',
      isCorrect: true,
    },
    {
      english: 'Мышь',
      russian: 'Computer',
      isCorrect: false,
    },
    {
      english: 'Notebook',
      russian: 'Ноутбук',
      isCorrect: true,
    },
    {
      english: 'Hear',
      russian: 'Слух',
      isCorrect: true,
    },
  ];

  constructor(private _cd: ChangeDetectorRef) {}

  shiftIndex: number = 0;
  trackByIdentity = (index: number, item: IWord) => item.english + item.russian;

  public get cards(): IWord[] {
    return this._cardSource.slice(
      this.shiftIndex,
      VISIBLE_CARDS + this.shiftIndex
    );
  }

  public onDropped(value: boolean): void {
    this.shiftIndex++;
    console.log(value);
    this._cd.detectChanges();
    console.log(this._cardSource);
  }
}

export interface IWord {
  russian: string;
  english: string;
  isCorrect: boolean;
}
