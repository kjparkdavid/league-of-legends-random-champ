import {
  Component,
  Input,
  HostListener,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'image-with-loading',
  templateUrl: './image-with-loading.component.html',
  styleUrls: ['./image-with-loading.component.css'],
})
export class ImageWithLoadingComponent implements OnChanges {
  @Input() loader: string =
    'https://media1.tenor.com/images/713a3272124cc57ba9e9fb7f59e9ab3b/tenor.gif';
  @Input() image: string;
  @Output() imageLoading = new EventEmitter<boolean>();

  isLoading: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.image.currentValue !== changes.image.previousValue) {
      this.isLoading = true;
      this.imageLoading.emit(this.isLoading);
    }
  }

  constructor() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
    this.imageLoading.emit(this.isLoading);
  }
}
