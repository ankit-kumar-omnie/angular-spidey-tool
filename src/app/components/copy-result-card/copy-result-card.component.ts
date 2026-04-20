import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyResultRecord } from '../../services/record-copy.service';

@Component({
  selector: 'app-copy-result-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copy-result-card.component.html',
  styleUrls: ['./copy-result-card.component.css'],
})
export class CopyResultCardComponent {
  @Input() record!: CopyResultRecord;
  @Output() refresh = new EventEmitter<string>();
  refreshing = signal(false);

  handleRefresh() {
    this.refreshing.set(true);
    this.refresh.emit(this.record.id);
    setTimeout(() => this.refreshing.set(false), 1000);
  }
}
