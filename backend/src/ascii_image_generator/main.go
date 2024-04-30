package main

import ("C"
		"fmt")
import "github.com/TheZoraiz/ascii-image-converter/aic_package"
//export ConvertAscii
func ConvertAscii(filePath *C.char, outPath *C.char) *C.char {
    // Assuming Convert is already implemented and returns a string

	flags := aic_package.Flags{
		Complex:             false,
		Dimensions:          nil,
		Width:               150,
		Height:              0,
		SaveTxtPath:         "",
		SaveImagePath:       C.GoString(outPath),
		SaveGifPath:         "",
		Negative:            false,
		Colored:             false,
		CharBackgroundColor: false,
		Grayscale:           false,
		CustomMap:           "",
		FlipX:               false,
		FlipY:               false,
		Full:                false,
		FontFilePath:        "",
		FontColor:           [3]int{255, 255, 255},
		SaveBackgroundColor: [4]int{0, 0, 0, 100},
		Braille:             false,
		Threshold:           128,
		Dither:              false,
		OnlySave:            false,
	}
	fmt.Println("Converted filePath:", C.GoString(filePath))
    result, err := aic_package.Convert(C.GoString(filePath), flags)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return nil
	}
	fmt.Printf("%s", result)
    return C.CString(result)
}

func main() {}