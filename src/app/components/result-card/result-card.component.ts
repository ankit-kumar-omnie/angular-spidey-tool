import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultRecord } from '../../services/report911.service';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-card.component.html',
  styleUrls: ['./result-card.component.css'],
})
export class ResultCardComponent {
  @Input() record!: ResultRecord;
  @Output() refresh = new EventEmitter<string>();
  refreshing = signal(false);

  get isActivation() { return this.record.activation !== undefined; }

  async handleRefresh() {
    this.refreshing.set(true);
    this.refresh.emit(this.record.id);
    setTimeout(() => this.refreshing.set(false), 1000);
  }
}
