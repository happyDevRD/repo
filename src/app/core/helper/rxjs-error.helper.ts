import { HttpErrorResponse } from '@angular/common/http'
import { Observable, OperatorFunction, of, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

/** Si el HTTP falla con 404, emite `[]` (u otro valor por defecto) y completa. */
export const catchNotFoundAsEmpty = <T>(
  emptyValue: T = [] as unknown as T,
): OperatorFunction<T, T> =>
  catchError((error: HttpErrorResponse): Observable<T> => {
    if (error.status === 404) {
      return of(emptyValue)
    }
    return throwError(() => error)
  })
