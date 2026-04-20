import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-token',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-token.component.html',
  styleUrls: ['./auth-token.component.css'],
})
export class AuthTokenComponent {
  @Input() token = '';
  @Output() tokenSave = new EventEmitter<string>();

  open = signal(false);
  draft = signal('');

  get isAuthorized() { return !!this.token; }

  handleOpen() { this.draft.set(this.token); this.open.set(true); }
  handleSave() { const t = this.draft().trim(); if (t) this.tokenSave.emit(t); this.open.set(false); }
  handleClear() { this.tokenSave.emit(''); }
  handleCancel() { this.open.set(false); }
}
