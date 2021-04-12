import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(videoURL: any) {
    console.log('Piping worked!');
    const slicedUrl = "https://www.youtube.com/embed/"+videoURL.slice(-11);
    console.log(this.sanitizer.bypassSecurityTrustResourceUrl(slicedUrl));
    return this.sanitizer.bypassSecurityTrustResourceUrl(slicedUrl);
  }

}
