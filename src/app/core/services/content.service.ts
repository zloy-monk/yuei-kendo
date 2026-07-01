import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { KendoEvent } from '../models/event.model';
import { Post } from '../models/post.model';
import { Schedule } from '../models/schedule.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private base = '/assets/content';

  // Фаза 2: заменить URL на Sanity API endpoint — компоненты не трогаем

  getPosts(): Observable<Post[]> {
    // Шаг 1: грузим индекс-файл со списком slug-ов
    // Шаг 2: switchMap — когда индекс готов, параллельно грузим все посты через forkJoin
    return this.http.get<{ slugs: string[] }>(`${this.base}/posts/index.json`).pipe(
      switchMap(({ slugs }) =>
        forkJoin(slugs.map(slug => this.http.get<Post>(`${this.base}/posts/${slug}.json`)))
      )
    );
  }

  getPost(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.base}/posts/${slug}.json`);
  }

  getEvents(): Observable<KendoEvent[]> {
    return this.http.get<{ slugs: string[] }>(`${this.base}/events/index.json`).pipe(
      switchMap(({ slugs }) =>
        forkJoin(slugs.map(slug => this.http.get<KendoEvent>(`${this.base}/events/${slug}.json`)))
      )
    );
  }

  getSchedule(): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.base}/schedule.json`);
  }
}
